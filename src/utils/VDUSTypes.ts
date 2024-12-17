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
  sortBy: Array<string | { key: string; order: 'asc' | 'desc'; }>; // depending if vuetify 2 or 3
  sortDesc: Array<boolean>; // not existing in vuetify 3
}

type VuetifyOptions = {
  page: number;
  itemsPerPage: number;
  sortBy: Array<string | { key: string; order: 'asc' | 'desc'; }>; // depending if vuetify 2 or 3
  sortDesc: Array<boolean>; // not existing in vuetify 3
  groupBy: Array<string>;
  groupDesc: Array<boolean>;
  multiSort: boolean;
  mustSort: boolean;
}

export {GenericDictionnary, VDUSConfiguration, VuetifySortArraysObject, VuetifyOptions, VDUSParamSchema, VDUSFormSchema, VDUSDatatableOptions}