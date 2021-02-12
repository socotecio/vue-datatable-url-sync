type GenericDictionnary = {
  [key: string]: any
}
type VDUSConfiguration = {
  prefix: string,
  debounceTime: number,
  serveurDefaultPageSize: number,
  extraQueryParams: GenericDictionnary
}

export {GenericDictionnary, VDUSConfiguration}