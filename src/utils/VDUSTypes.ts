type GenericDictionnary = {
  [key: string]: any
}
type VDUSConfiguration = {
  prefix: string,
  debounceTime: number,
  serveurDefaultPageSize: number,
  extraQueryParams: GenericDictionnary
}

type VuetifySortArraysObject = {
  sortBy: Array<string>,
  sortDesc: Array<boolean>
}

type VuetifyOptions = {
  page: number,
  itemsPerPage: number,
  sortBy: Array<string>,
  sortDesc: Array<boolean>,
  groupBy: Array<string>,
  groupDesc: Array<boolean>,
  multiSort: boolean,
  mustSort: boolean
}

export {GenericDictionnary, VDUSConfiguration, VuetifySortArraysObject, VuetifyOptions}