type GenericDictionnary = {
  [key: string]: any;
}

type VDUSParamSchema = {
  name?: string;
  default?: any;
  type?: "string" | "boolean" | "integer" | "arrayInt" | "arrayString" | "nullBoolean";
}

type VDUSFormSchema = {
  [key: string]: VDUSParamSchema;
}

type VDUSDatatableOptions = {
  page?: number;
  page_size?: number;
  ordering?: Array<string>;
}

type VDUSConfiguration = {
  prefix?: string;
  debounceTime?: number;
  serveurDefaultPageSize?: number;
  extraQueryParams?: GenericDictionnary;
  updateFormFunction?: Function | null;
}

type VuetifySortArraysObject = {
  sortBy: Array<string>;
  sortDesc: Array<boolean>;
}

type VuetifyOptions = {
  page: number;
  itemsPerPage: number;
  sortBy: Array<string>;
  sortDesc: Array<boolean>;
  groupBy: Array<string>;
  groupDesc: Array<boolean>;
  multiSort: boolean;
  mustSort: boolean;
}

export {GenericDictionnary, VDUSConfiguration, VuetifySortArraysObject, VuetifyOptions, VDUSParamSchema, VDUSFormSchema, VDUSDatatableOptions}