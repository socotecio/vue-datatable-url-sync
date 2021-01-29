// import debounce from "lodash.debounce";
import {
  readFormAndOptionsFromLocalQuery,
  //generateQueryFromObject,
  convertParamIfTypeInSchema,
  getRemovedKeyBetweenTwoObject,
  //getDefaultValueForParam
} from "./utils/listPaginatedTools";
//import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";

import { ref, onMounted, watch, toRef, reactive } from 'vue'
import { useRoute } from 'vue-router'

type GenericDictionnary = {
  [key: string]: any
}

/*
DOC here on params and return value
*/
export default function useDatatableUrlSync(form: GenericDictionnary, fetchDatas: Function, options: GenericDictionnary, formSchema?: GenericDictionnary, prefix:string="", initializeForm?: Function) {

  // data 
  const route = useRoute();

  let ignoredQueryParams:GenericDictionnary = {};
  const extraQueryParams:GenericDictionnary = {};
  let localQuery:GenericDictionnary = {};
  const defaultFormSchema:GenericDictionnary = {
    page: { type: "integer", default: 1 },
    page_size: { type: "integer", default: 10 },
    ordering: { type: "arrayString", default: [] }
  }
  const loading = ref<Boolean>(false);
  let disableRouterWatch = false;


  watch(form, (newForm) => {
    console.log("new form: ", newForm)
  })



  //methods
  /* DOC
  */
  const getDatas = async () => {
    try {
      loading.value = true;

      let queryAsObject = {}

      if (fetchDatas) {
        const queryParams = new URLSearchParams(queryAsObject).toString();
        await fetchDatas(queryParams, queryAsObject);
      }
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  /*
  Doc
  */
  const getLocalCopyOfQueryUrl = () => {
    let newLocalQuery: GenericDictionnary = {};
    Object.keys(route.query).forEach(key => {
      // We remove the prefix for the local copy to be agnostic of it in the code
      let keyWithoutPrefix = key.replace(prefix, "");

      // typeof undefined is important
      if (
        key.startsWith(prefix) &&
        (typeof form[keyWithoutPrefix] !== "undefined" ||
          typeof options[keyWithoutPrefix] !== "undefined")
      ) {
        newLocalQuery[keyWithoutPrefix] = convertParamIfTypeInSchema(
          route.query,
          keyWithoutPrefix,
          formSchema,
          prefix
        );
      } else {
        // we save them in extra Query to continue to use them
        // We do not want to change it as it is ignored so we don't remove prefix
        ignoredQueryParams[key] = route.query[key];
      }
    });
    return newLocalQuery;
  }

  /*
  Doc
  */
  const updateFormIfNeeded = (newForm: GenericDictionnary) => {
    newForm = { ...form, ...newForm };
    if (isEqual(form, newForm)) {
      return false;
    }
    form = newForm;
    return true;
  }

  /*
  Doc
  */
  const updateOptionsIfNeeded = (newOptions: GenericDictionnary) => {
    newOptions = { ...options, ...newOptions };
    if (isEqual(options, newOptions)) {
      return false;
    }

    options = newOptions;
    return true;
  }

  /*
  DOC
  */
  const initializeFromRouter = (created: Boolean) => {
    // Need to select only elements that are in this.form to avoid multiple instance reload between them
    ignoredQueryParams = {};

    // localQuery is the memory of the query in url to know when reload data.
    let newLocalQuery = getLocalCopyOfQueryUrl();

    //To keep for debug please
    // console.log(
    //   "initializeFromRouter",
    //   JSON.stringify(localQuery),
    //   JSON.stringify(newLocalQuery),
    //   options.name
    // );

    // route.query can change of instance if we route push in router children. SO we juste assure that we do not fetch data again if the current query object is the same than the new
    // If it's the created call we get datas as initialization because if route.query is empty it will not trigger call
    if (isEqual(localQuery, newLocalQuery)) {
      if (created) {
        if(initializeForm){
          initializeForm();
        }
        getDatas();
      }
      return;
    }

    const removedParams = getRemovedKeyBetweenTwoObject(
      localQuery,
      newLocalQuery
    );

    localQuery = newLocalQuery;

    let { newForm, newOptions } = readFormAndOptionsFromLocalQuery(
      localQuery,
      form,
      options,
      formSchema,
      removedParams
    );
    const formUpdated = updateFormIfNeeded(newForm);

    // If the form is updated because an other component pushed a new value that we was watching
    // And we was not on the first page we need to go back to the first page
    if (formUpdated && options.page > 1) {
      options.page = 1;
    }

    updateOptionsIfNeeded(newOptions);

    if(initializeForm) {
      initializeForm();
    }

    getDatas()
  }


  // Created: launch all the funtion needed at initialization
  initializeFromRouter(true)

  return {
    loading
  }
}