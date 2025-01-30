export type JSONArray = Array<JSONValue>;
export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | JSONArray;
