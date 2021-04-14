import { format } from "date-fns";
import { FlowTypes } from "src/app/shared/model/flowTypes";

/**
 * Generate a random string of characters in base-36 (a-z and 0-9 characters)
 * @returns uxokjq8co1n
 * Adapted from https://gist.github.com/6174/6062387
 */
export function generateRandomId() {
  return Math.random().toString(36).substring(2);
}

/**
 * generate a string representation of the current datetime in local (unspecified) timezone
 * @returns 2020-12-22T18:15:20
 */
export function generateTimestamp(value?: string | number | Date) {
  const date = value ? new Date(value) : new Date();
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

/**
 * Convert an object array into a json object, with keys corresponding to array entries
 * @param keyfield any unique field which all array objects contain to use as hash keys (e.g. 'id')
 */
export function arrayToHashmap<T>(arr: T[], keyfield: string): { [key: string]: T } {
  const hashmap: { [key: string]: T } = {};
  for (const el of arr) {
    if (el.hasOwnProperty(keyfield)) {
      hashmap[el[keyfield]] = el;
    }
  }
  return hashmap;
}

/**
 * Similar as arrayToHashmap, but instead allows duplicate id entries, storing values in an array by hash keyfield
 * @param keyfield any unique field which all array objects contain to use as hash keys (e.g. 'id')
 */
export function arrayToHashmapArray<T>(arr: T[], keyfield: keyof T) {
  const hashmap: { [key: string]: T[] } = {};
  for (const el of arr) {
    if (el.hasOwnProperty(keyfield)) {
      if (!hashmap[el[keyfield as string]]) {
        hashmap[el[keyfield as string]] = [];
      }
      hashmap[el[keyfield as string]].push(el);
    }
  }
  return hashmap;
}

/**
 * Retrieve a nested property from a json object
 * using a single path string accessor
 * (modified from https://gist.github.com/jasonrhodes/2321581)
 *
 * @returns value if exists, or null otherwise
 *
 * @example
 * const obj = {"a":{"b":{"c":1}}}
 * getNestedProperty(obj,'a.b.c')  // returns 1
 * getNestedProperty(obj,'a.b.c.d')  // returns null
 *
 * @param obj data object to iterate over
 * @param path nested path, such as data.subfield1.deeperfield2
 */
export function getNestedProperty(obj: any, path: string) {
  return path.split(".").reduce((prev, current) => {
    return prev ? prev[current] : null;
  }, obj);
}

/**
 * Take a string and split into an array based on character separator.
 * Removes additional whitespace and linebreak characters and empty values
 */
export function stringToArray(str: string = "", separator = ";") {
  return (
    str
      .replace(/\r\n/, "")
      .split(separator)
      .map((s) => s.trim())
      // remove empty strings, undefined or null values
      .filter((el) => !!el)
  );
}

/**
 * Return a specific parameter from the row, as default type
 * (usually string, unless populated from local variables in which case could be string[])
 * */
export function getParamFromTemplateRow(
  row: FlowTypes.TemplateRow,
  name: string,
  _default: string
): string | string[] {
  const params = row.parameter_list || {};
  return params.hasOwnProperty(name) ? params[name] : _default;
}
export function getStringParamFromTemplateRow(
  row: FlowTypes.TemplateRow,
  name: string,
  _default: string
): string {
  var paramValue = getParamFromTemplateRow(row, name, _default) as string;
  return paramValue ? `${paramValue}` : paramValue;
}

/** Return a specific parameter, parsed as a number */
export function getNumberParamFromTemplateRow(
  row: FlowTypes.TemplateRow,
  name: string,
  _default: number
): number {
  return Number(getParamFromTemplateRow(row, name, `${_default}`));
}

/** Return a specific parameter, parsed as a boolean */
export function getBooleanParamFromTemplateRow(
  row: FlowTypes.TemplateRow,
  name: string,
  _default: boolean
): boolean {
  const params = row.parameter_list || {};
  return params.hasOwnProperty(name) ? params[name] === "true" : _default;
}
