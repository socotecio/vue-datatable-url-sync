import {
  elementToArrayOfInt,
  elementToArrayOfString,
  extractBooleanValue,
  extractIntegerValue
} from "./helpers";
import isEqual from "lodash.isequal";
import {GenericDictionnary} from "./VDUSTypes"

/*
  This function take a object in parameter that is often a form of filtering field
  all this field are filtered before being used to be transformed as a query url
  if localName is true it will no replace the param key with the real used for backend query
  if localName is false the name will be replaced by the correct one sended to backend
  */
function generateQueryFromObject(object: GenericDictionnary, schema?: GenericDictionnary, localName: Boolean = true): GenericDictionnary {
  let queryUrl: GenericDictionnary = {};
  for (let [key, value] of Object.entries(object)) {
    // We do not want to send a default value
    if (isValueDefault(value, key, schema)) {
      continue;
    }

    // by default the quey key is the same that the form key
    let queryKey = key;
    // But this can be overrided if name attribute is defined in the param schema
    if (!localName && schema && schema[key] && schema[key].name) {
      queryKey = schema[key].name;
    }

    queryUrl[queryKey] = value;
  }
  return queryUrl;
}

function getDefaultValueForParam(param: string, schema?: GenericDictionnary): any {
  if (schema && schema[param]) {
    // if there is a defautl value we change the condition to is non equality
    if (schema[param].default) {
      // TODO default value for array need to be stringify ?
      return schema[param].default;
    }
    // Else if we have a type we try to match the default for the type
    else if (schema[param].type === "boolean") {
      // Default for boolean is false
      return false;
    } else if (["arrayInt", "arrayString"].includes(schema[param].type)) {
      // Default for array is empty array or first element null or empty
      return [];
    }
  }
  return null;
}

function isValueDefault(value: any, param: string, schema?: GenericDictionnary): boolean {
  // Default is string
  let isValueDefault: boolean = value === "";

  if (schema && schema[param]) {
    // if there is a defautl value we change the condition to is non equality
    if (schema[param].default) {
      // TODO default value for array need to be stringify ?
      if (Array.isArray(value)) {
        isValueDefault = isEqual(value, schema[param].default) || !value.length;
      } else {
        isValueDefault = value === schema[param].default;
      }
    }
    // Else if we have a type we try to match the default for the type
    else if (schema[param].type === "boolean") {
      // Default for boolean is false
      isValueDefault = value === false;
    } else if (["arrayInt", "arrayString"].includes(schema[param].type)) {
      // Default for array is empty array or first element null or empty
      isValueDefault =
        value.length === 0 || value[0] === null || value[0] === "";
    }
  }

  // We always check if value not null AND the specific condition
  return value === null || isValueDefault;
}

/*
  Transform query parameter from vue router to two javascript objects representing the filtering form and the options
  */
function readFormAndOptionsFromLocalQuery(
  query: GenericDictionnary,
  form: GenericDictionnary,
  options: GenericDictionnary,
  schema?: GenericDictionnary,
  removedParam: Array<string> = []
): {newOptions: GenericDictionnary, newForm: GenericDictionnary} {
  let newOptions: GenericDictionnary = {};
  let newForm: GenericDictionnary = {};
  for (let param in query) {
    if (typeof form[param] !== "undefined") {
      newForm[param] = convertParamIfTypeInSchema(query, param, schema);
    } else if (typeof options[param] !== "undefined") {
      newOptions[param] = convertParamIfTypeInSchema(query, param, schema);
    }
  }
  // This allow to reset to default deleted param by other component
  removedParam.forEach(param => {
    if (typeof form[param] !== "undefined") {
      newForm[param] = getDefaultValueForParam(param, schema);
    }
  });
  removedParam.forEach(param => {
    if (typeof options[param] !== "undefined") {
      newOptions[param] = getDefaultValueForParam(param, schema);
    }
  });
  return { newOptions, newForm };
}

function convertParamIfTypeInSchema(query: GenericDictionnary, param: string, schema?: GenericDictionnary, prefix: string = ""): any {
  if (!schema || !schema[param] || !schema[param].type) {
    return query[prefix + param];
  }
  if (schema[param].type === "boolean") {
    return extractBooleanValue(query[prefix + param]);
  }
  if (schema[param].type === "integer") {
    return extractIntegerValue(query[prefix + param]);
  }
  if (schema[param].type === "arrayInt") {
    return elementToArrayOfInt(query[prefix + param]);
  }
  if (schema[param].type === "arrayString") {
    return elementToArrayOfString(query[prefix + param]);
  }

  return query[prefix + param];
}

function getRemovedKeyBetweenTwoObject(originalObject: GenericDictionnary, newObject: GenericDictionnary): Array<string> {
  const originalObjectKeys: Array<string> = Object.keys(originalObject);
  const newObjectKeys: Array<string> = Object.keys(newObject);
  return originalObjectKeys.filter(
    originalKey => !newObjectKeys.includes(originalKey)
  );
}

export {
  generateQueryFromObject,
  readFormAndOptionsFromLocalQuery,
  convertParamIfTypeInSchema,
  getRemovedKeyBetweenTwoObject,
  getDefaultValueForParam
};
