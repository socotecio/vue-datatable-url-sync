import {
  elementToArrayOfInt,
  elementToArrayOfString,
  extractBooleanValue,
  extractNullBooleanValue,
  extractIntegerValue
} from "./helpers";
import isEqual from "lodash.isequal";
import {GenericDictionnary, VDUSDatatableOptions, VDUSFormSchema} from "./VDUSTypes"

const getDefaultValueForParam = (param: string, schema?: VDUSFormSchema): any => {
  if (schema?.[param]) {
    // if there is a defautl value we change the condition to is non equality
    if (schema[param].default) {
      // TODO default value for array need to be stringify ?
      return schema[param].default;
    }
    // Else if we have a type we try to match the default for the type
    else if (schema[param].type === "boolean") {
      // Default for boolean is false
      return false;
    } else if (["arrayInt", "arrayString"].includes(schema[param].type as string)) {
      // Default for array is empty array or first element null or empty
      return [];
    }
  }
  return null;
}

const isValueDefault = (value: any, param: string, schema?: VDUSFormSchema): boolean => {
  // Default is string
  let isValueDefault: boolean = value === "";

  if (schema?.[param]) {
    // if there is a defautl value we change the condition to is non equality
    if (typeof(schema[param].default) !== "undefined") {
      // We have a special case for nullBoolean because we can have null value that is not the default
      if(schema[param]?.type === "nullBoolean") {
        return schema[param].default === extractNullBooleanValue(value, schema[param].default)
      }
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
    } else if (schema[param].type === "nullBoolean") {
      // Default for null boolean is null.
      isValueDefault = value === '';
    } else if (["arrayInt", "arrayString"].includes(schema[param].type as string)) {
      // Default for array is empty array or first element null or empty
      isValueDefault =
        value.length === 0 || value[0] === null || value[0] === "";
    }
  }

  // We always check if value not null AND the specific condition
  return value === null || isValueDefault;
}

/*
  This function take a object in parameter that is often a form of filtering field
  all this field are filtered before being used to be transformed as a query url
  if localName is true it will no replace the param key with the real used for backend query
  if localName is false the name will be replaced by the correct one sended to backend
  */
const generateQueryFromObject = (object: GenericDictionnary, schema?: VDUSFormSchema, localName = true): GenericDictionnary => {
  const queryUrl: GenericDictionnary = {};
  for (const [key, value] of Object.entries(object)) {
    // We do not want to send a default value
    if (isValueDefault(value, key, schema)) {
      continue;
    }

    // by default the quey key is the same that the form key
    let queryKey = key;
    let queryValue = value;
    // But this can be overrided if name attribute is defined in the param schema
    if (!localName && schema?.[key]?.name) {
      queryKey = (schema[key].name as string); // typescript error because .name can be undefined but if check it before
    }

    // As ordering key is a special key where other key can be specified inside its value we need to check for each ordernig key if there is a different server name
    if (key === 'ordering' && !localName && value && Array.isArray(value)) {
      queryValue = value.map((orderItem: string) => {
        let prefix = ""
        // If we have a desc order we need to remove the - to match with the schema
        if (orderItem.startsWith("-")) {
          orderItem = orderItem.replace("-", "");
          prefix = "-"
        }
        // Look if we have a specific server name for this attribute in the schema.
        if(schema?.[orderItem]?.name) {
          orderItem = (schema[orderItem].name as string)
        }
        // Do not forget to add the prefix to have the correct ordering
        return `${prefix}${orderItem}`;
      })
    }
    queryUrl[queryKey] = queryValue;
  }
  return queryUrl;
}

const convertParamIfTypeInSchema = (query: GenericDictionnary, param: string, schema?: VDUSFormSchema, prefix = ""): any => {
  if (!schema?.[param]?.type) {
    return query[prefix + param];
  }
  if (schema[param].type === "boolean") {
    return extractBooleanValue(query[prefix + param]);
  }
  if (schema[param].type === "nullBoolean") {
    return extractNullBooleanValue(query[prefix + param], schema[param].default);
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

/*
  Transform query parameter from vue router to two javascript objects representing the filtering form and the options
  */
const readFormAndOptionsFromLocalQuery = (
  query: GenericDictionnary,
  form: GenericDictionnary,
  options: VDUSDatatableOptions,
  schema?: VDUSFormSchema,
  removedParam: Array<string> = []
): {newOptions: VDUSDatatableOptions; newForm: GenericDictionnary} => {

  const newOptions: VDUSDatatableOptions = {};
  const newForm: GenericDictionnary = {};
  
  for (const param in query) {
    if (typeof form[param] !== "undefined") {
      newForm[param] = convertParamIfTypeInSchema(query, param, schema);
    } else if (typeof (options as GenericDictionnary)[param] !== "undefined") {
      (newOptions as GenericDictionnary)[param] = convertParamIfTypeInSchema(query, param, schema);
    }
  }
  // This allow to reset to default deleted param by other component
  removedParam.forEach(param => {
    if (typeof form[param] !== "undefined") {
      newForm[param] = getDefaultValueForParam(param, schema);
    }
  });
  removedParam.forEach(param => {
    if (typeof (options as GenericDictionnary)[param] !== "undefined") {
      (newOptions as GenericDictionnary)[param] = getDefaultValueForParam(param, schema);
    }
  });
  return { newOptions, newForm };
}

const getRemovedKeyBetweenTwoObject = (originalObject: GenericDictionnary, newObject: GenericDictionnary): Array<string> => {
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
