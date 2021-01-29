// import debounce from "lodash.debounce";
// import {
//   readFormAndOptionsFromLocalQuery,
//   generateQueryFromObject,
//   convertParamIfTypeInSchema,
//   getRemovedKeyBetweenTwoObject,
//   getDefaultValueForParam
// } from "./utils/listPaginatedTools";
// import cloneDeep from "lodash.clonedeep";
// import isEqual from "lodash.isEqual";

import { ref, onMounted, watch, toRef, reactive } from 'vue'

export default function useDatatableUrlSync(form: Object, fetchDatas: Function) {

  // data 
  let loading = ref<Boolean>(false)

  watch(form, (newForm) => {
    console.log("new form: ", newForm)
  })



  //methods
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

  const initializeFromRouter = (created: Boolean) => {


    getDatas()
  }


  // Created: launch all the funtion needed at initialization
  initializeFromRouter(true)

  return {
    loading
  }
}