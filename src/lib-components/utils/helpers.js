export const elementToArrayOfInt = element => {
  return ["number", "string"].includes(typeof element)
    ? [parseInt(element)]
    : element.map(item => parseInt(item));
};

export const elementToArrayOfString = element => {
  return element ? (typeof element === "string" ? [element] : element) : [];
};

export const isDifferentLists = (list1, list2) => {
  list1 = list1.sort((a, b) => a - b);
  list2 = list2.sort((a, b) => a - b);
  if (JSON.stringify(list1) !== JSON.stringify(list2)) {
    return true;
  }
  return false;
};

export const extractBooleanValue = (value, defaultValue = true) => {
  return value ? value.toString() === "true" : defaultValue;
};

export const extractIntegerValue = (value, defaultValue = 0) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
