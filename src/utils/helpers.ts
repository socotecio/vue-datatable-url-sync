import {VuetifySortArraysObject} from "./VDUSTypes";

export const elementToArrayOfInt = (element: any):Array<number> => {
  return ["number", "string"].includes(typeof element)
    ? [parseInt(element)]
    : element.map((item:any) => parseInt(item));
};

export const elementToArrayOfString = (element: any): Array<string> => {
  return element ? (typeof element === "string" ? [element] : element) : [];
};

export const extractBooleanValue = (value: any, defaultValue:Boolean = true):Boolean => {
  return value ? value.toString() === "true" : defaultValue;
};

export const extractIntegerValue = (value:any, defaultValue:number = 0):number => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const getSortsArrayFromOrdering = (ordering:Array<string>):VuetifySortArraysObject => {
  if (!ordering) {
    return { sortBy: [], sortDesc: [] };
  }
  let sortBy:Array<string> = [];
  let sortDesc:Array<boolean> = [];

  ordering.forEach(orderItem => {
    let isDesc:boolean = false;
    if (orderItem.startsWith("-")) {
      orderItem = orderItem.replace("-", "");
      isDesc = true;
    }
    sortBy.push(orderItem);
    sortDesc.push(isDesc);
  });

  return { sortBy, sortDesc };
}

export const getOrderingFromSortArray = (sortBy:Array<string>, sortDesc:Array<boolean>):Array<string> => {
  let ordering:Array<string> = [];
  sortBy.forEach((orderItem, index) => {
    let isDesc:boolean = true;
    if (sortDesc.length > index) {
      isDesc = sortDesc[index];
    }
    ordering.push(`${isDesc ? "-" : ""}${orderItem}`);
  });
  return ordering;
}