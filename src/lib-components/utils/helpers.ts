export const elementToArrayOfInt = (element: any):Array<number> => {
  return ["number", "string"].includes(typeof element)
    ? [parseInt(element)]
    : element.map((item:any) => parseInt(item));
};

export const elementToArrayOfString = (element: any) => {
  return element ? (typeof element === "string" ? [element] : element) : [];
};

export const extractBooleanValue = (value: any, defaultValue:Boolean = true) => {
  return value ? value.toString() === "true" : defaultValue;
};

export const extractIntegerValue = (value:any, defaultValue:number = 0) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
