import {VuetifySortArraysObject} from "./VDUSTypes";

export const elementToArrayOfInt = (element: any): Array<number> => {
  return ["number", "string"].includes(typeof element)
    ? [extractIntegerValue(element)]
    : element.map((item: any) => extractIntegerValue(item));
};

export const elementToArrayOfString = (element: any): Array<string> => {
  return element ? (typeof element === "string" ? [element] : element) : [];
};

export const extractBooleanValue = (value: any, defaultValue:boolean|null = true): boolean|null => {
  return value ? value.toString() === "true" : defaultValue;
};

export const extractNullBooleanValue = (value: any, defaultValue:boolean|null = true): boolean|null => {
  if(value === null) {
    return null
  }
  if(value.toString() === "true") {
    return true
  }
  if(value.toString() === "false") {
    return false
  }
  if(["null", ""].includes(value.toString())) {
    return null
  }
  return defaultValue
};


export const extractIntegerValue = (value: any, defaultValue = 0): number => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const getSortsArrayFromOrdering = (ordering: Array<string>|null): VuetifySortArraysObject => {
  if (!ordering) {
    return { sortBy: [], sortDesc: [] };
  }
  const sortBy: Array<string> = [];
  const sortDesc: Array<boolean> = [];

  ordering.forEach(orderItem => {
    let isDesc = false;
    if (orderItem.startsWith("-")) {
      orderItem = orderItem.replace("-", "");
      isDesc = true;
    }
    sortBy.push(orderItem);
    sortDesc.push(isDesc);
  });

  return { sortBy, sortDesc };
}

export const getOrderingFromSortArray = (sortBy: Array<string>, sortDesc: Array<boolean>): Array<string> => {
  const ordering: Array<string> = [];
  sortBy.forEach((orderItem, index) => {
    let isDesc = true;
    if (sortDesc.length > index) {
      isDesc = sortDesc[index];
    }
    ordering.push(`${isDesc ? "-" : ""}${orderItem}`);
  });
  return ordering;
}