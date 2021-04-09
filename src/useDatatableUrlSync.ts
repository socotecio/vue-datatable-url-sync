import debounce from "lodash.debounce";
import {
  readFormAndOptionsFromLocalQuery,
  generateQueryFromObject,
  convertParamIfTypeInSchema,
  getRemovedKeyBetweenTwoObject,
  getDefaultValueForParam
} from "./utils/listPaginatedTools";
import {
  getSortsArrayFromOrdering,
  getOrderingFromSortArray
} from "./utils/helpers";
import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";

import { ref, watch, nextTick, computed, Ref } from 'vue-demi'
import {GenericDictionnary, VDUSConfiguration, VuetifyOptions, VDUSFormSchema, VDUSDatatableOptions} from "./utils/VDUSTypes"

/*
DOC here on params and return value
*/
export default function useDatatableUrlSync(route: any, router: any, form: Ref<GenericDictionnary>, fetchDatas: Function, options: Ref<VDUSDatatableOptions>, formSchema?: VDUSFormSchema, initializeForm?: Function, configurations?: VDUSConfiguration) { 

  // ----------------------------- DEFAULTING PARAMS ------------------------------
  configurations = {
    // use a prefix to differentiate possible same name if two component use the same mixin
    prefix: "",
    // Time of included debounce function
    debounceTime: 0,
    // The default value of the serveur to be sur to put it in the request event if not shown in url because default value
    serveurDefaultPageSize: 10,
    // This mean to be overrided to add query params that are fixed and should not appear in url
    extraQueryParams: {},
    ...configurations || {}
  }
  options.value = {
    page: 1,
    page_size: configurations.serveurDefaultPageSize,
    ordering: [],
    ...options.value
  }
  formSchema = {
    page: { type: "integer", default: 1 },
    page_size: { type: "integer", default: 10 },
    ordering: { type: "arrayString", default: [] },
    ...formSchema || {}
  }

  // ----------------------------- DATA ------------------------------
  let ignoredQueryParams: GenericDictionnary = {};
  let localQuery: GenericDictionnary = {};
  const loading = ref<boolean>(false);
  let disableRouterWatch = false;

  const debounceSearch = debounce(isFilter => {
    localQuery = triggerSearchIfNeeded(isFilter, getDatas);
  }, configurations?.debounceTime || 0);

  // ----------------------------- COMPUTED ---------------------------

  const vuetifyOptions = computed({
    get: (): VuetifyOptions => {
      const vuetifyOptions: VuetifyOptions = {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false
      };

      vuetifyOptions.page = options.value.page ?? getDefaultValueForParam("page", formSchema);
      vuetifyOptions.itemsPerPage = options.value.page_size ?? getDefaultValueForParam("page_size", formSchema);

      const ordering: Array<string> =
        Array.isArray(options.value.ordering) &&
        options.value.ordering.length > 0
          ? options.value.ordering
          : getDefaultValueForParam("ordering", formSchema);

      const { sortBy, sortDesc } = getSortsArrayFromOrdering(ordering);

      vuetifyOptions.sortBy = sortBy;
      vuetifyOptions.sortDesc = sortDesc;

      return vuetifyOptions;
    },
    set: (newOptions: VuetifyOptions) => {
      // As we do not define options by default, to avoid reload from other component we doesn't want, we need to set data because they are not reactive
      options.value.page = newOptions.page;
      options.value.page_size = newOptions.itemsPerPage;
      options.value.ordering = getOrderingFromSortArray(newOptions.sortBy, newOptions.sortDesc)
    }
  })

  // ----------------------------- WATCH ------------------------------
  watch(form, () => {
    debounceSearch(true);
  }, { deep: true })

  watch(options, () => {
    nextTick(() => {
      localQuery = triggerSearchIfNeeded(false, getDatas);
    });
  }, { deep: true })


  watch(() => route.query, () => {
    if (disableRouterWatch) {
      disableRouterWatch = false;
      return;
    }
    initializeFromRouter(false);
  }, { deep: true })


  // ----------------------------- METHODS ------------------------------

  /*
  This function compare the current form and options to the current query and call triggerFunction if some change are detected 
  isFilter is true if it's a filter attribute taht changed. This allow us to reset the page number to 1
  This allow to fetch data in back end and apply the filter in the url query 
  */
  const triggerSearchIfNeeded = (isFilter: boolean, triggerFunction: Function) => {
    const newLocalQuery: GenericDictionnary = {
      ...generateQueryFromObject(form.value, formSchema, true),
      ...generateQueryFromObject(options.value, formSchema, true)
    };

    // To keep for debug please
    // console.log(
    //   "triggerSearchIfNeeded",
    //   JSON.stringify(localQuery),
    //   JSON.stringify(newLocalQuery),
    //   options.value?.name
    // );

    // Do nothing if nothing change
    if (isEqual(localQuery, newLocalQuery)) {
      return localQuery;
    }

    // If filter change we need to go back to first page
    // This is not ideal because options has a watcher on it too so triggerSearchIfNeeded is called twice even if comparaison avoid 2 call to the server.
    // Other solutions would be to check if options.page > 1 in form watcher and if true only change options.page to 1 and let options watcher do the job else call this function
    // Choose this method because the code is shared here and not duplicated in watcher. Can be refactored if used vue Composition API
    if (newLocalQuery.page && isFilter) {
      delete newLocalQuery.page;
      options.value.page = 1;
    }
    disableRouterWatch = true;

    // As we have a local copy of the query without the prefix to help readability and developper experience
    // We need to set back the prefix before pushing
    const newLocalQueryWithPrefix: GenericDictionnary = {};
    Object.entries(newLocalQuery).forEach(([key, value]) => {
      newLocalQueryWithPrefix[configurations?.prefix + key] = value;
    });
    router.push({
      query: { ...newLocalQueryWithPrefix, ...ignoredQueryParams }
    });

    triggerFunction();
    return cloneDeep(newLocalQuery);
  }

  /* DOC
  */
  const getDatas = async () => {
    try {
      loading.value = true;

      const queryAsObject: GenericDictionnary = {
        ...generateQueryFromObject(form.value, formSchema, false),
        ...generateQueryFromObject(options.value, formSchema, false),
        ...configurations?.extraQueryParams || {}
      };

      // Even if value is default for page number if it's not the server default we need to add it
      if (
        options.value.page_size &&
        options.value.page_size !== configurations?.serveurDefaultPageSize
      ) {
        queryAsObject.page_size = options.value.page_size;
      }

      if (fetchDatas) {
        const queryParams = new URLSearchParams(queryAsObject).toString();
        await fetchDatas(queryParams, queryAsObject);
      }
    } finally {
      loading.value = false;
    }
  }

  /*
  Doc
  */
  const getLocalCopyOfQueryUrl = () => {
    const newLocalQuery: GenericDictionnary = {};
    Object.keys(route.query).forEach(key => {
      // We remove the prefix for the local copy to be agnostic of it in the code
      const keyWithoutPrefix = key.replace(configurations?.prefix || "", "");

      // typeof undefined is important
      if (
        key.startsWith(configurations?.prefix || "") &&
        (typeof form.value[keyWithoutPrefix] !== "undefined" ||
          typeof (options.value as GenericDictionnary)[keyWithoutPrefix] !== "undefined")
      ) {
        newLocalQuery[keyWithoutPrefix] = convertParamIfTypeInSchema(
          route.query,
          keyWithoutPrefix,
          formSchema,
          configurations?.prefix
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
    newForm = { ...form.value, ...newForm };
    if (isEqual(form.value, newForm)) {
      return false;
    }
    form.value = newForm;
    return true;
  }

  /*
  Doc
  */
  const updateOptionsIfNeeded = (newOptions: VDUSDatatableOptions) => {
    newOptions = { ...options.value, ...newOptions };
    if (isEqual(options.value, newOptions)) {
      return false;
    }

    options.value = newOptions;
    return true;
  }

  /*
  DOC
  */
  const initializeFromRouter = (created: boolean) => {
    // Need to select only elements that are in this.form to avoid multiple instance reload between them
    ignoredQueryParams = {};

    // localQuery is the memory of the query in url to know when reload data.
    const newLocalQuery = getLocalCopyOfQueryUrl();

    //To keep for debug please
    // console.log(
    //   "initializeFromRouter",
    //   JSON.stringify(localQuery),
    //   JSON.stringify(newLocalQuery),
    //   options.value.name
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

    const removedParams: Array<string> = getRemovedKeyBetweenTwoObject(
      localQuery,
      newLocalQuery
    );

    localQuery = newLocalQuery;

    const { newForm, newOptions } = readFormAndOptionsFromLocalQuery(
      localQuery,
      form.value,
      options.value,
      formSchema,
      removedParams
    );
    const formUpdated = updateFormIfNeeded(newForm);

    // If the form is updated because an other component pushed a new value that we was watching
    // And we was not on the first page we need to go back to the first page
    const currentPageNumber: number = options.value.page || 1;
    if (formUpdated && currentPageNumber > 1) {
      options.value.page = 1;
    }

    updateOptionsIfNeeded(newOptions);

    if(initializeForm) {
      initializeForm();
    }

    getDatas()
  }

  // ---------------------------------- LIFECYCLE CREATED ----------------------------------------
  // launch all the function needed at initialization
  initializeFromRouter(true)

  return {
    vuetifyOptions,
    loading
  }
}