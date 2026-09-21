import * as Sentry from "@sentry/nextjs";
import { ParsedUrlQuery } from "querystring";

class JSHelpers {
  static isFunction(functionToCheck: unknown): functionToCheck is Function {
    return typeof functionToCheck === "function";
  }

  static isEmptyObject(obj?: Object): obj is Object {
    if (obj === null) return true;
    return !!obj && typeof obj === "object" && Object.keys(obj).length === 0;
  }

  static isEmptyArray(arr?: Array<any>): arr is Array<any> {
    return Array.isArray(arr) && arr.length === 0;
  }

  static isEmpty(value: any): value is typeof value {
    if (Array.isArray(value)) return this.isEmptyArray(value);
    switch (typeof value) {
      case "object":
        return JSHelpers.isEmptyObject(value);
      case "string":
        return value === "";
      case "number":
        return value === 0;
      case "boolean":
        return !value;
      case "function":
        return false;
      default:
        return true;
    }
  }

  static isOnlyNumberAndSpaces(value: string): boolean {
    return /^[0-9\s]*$/.test(value);
  }

  static isNumber = (str: string) => str.trim().length > 0 && !isNaN(Number(str.trim()));

  static getFromDeviceStore = <T>(key: string, defaultValue?: T): T => {
    try {
      const value = window.localStorage.getItem(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return defaultValue as T;
    } catch (e) {
      this.setInDeviceStore(key, defaultValue);
      return defaultValue as T;
    }
  };

  static setInDeviceStore = <T>(key: string, value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      Sentry.captureException(e, { level: "info" });
    }
  };

  static getKeyValueFromNextQueryParams = (key: string, query: ParsedUrlQuery): string | undefined => {
    if (!query) return undefined;
    const value = query[key];
    if (Array.isArray(value)) return value[0];
    return value;
  };

  static callSafely = (fn: Function) => {
    try {
      fn();
    } catch (e) {}
  };

  static isNullOrEmpty = (val: any): boolean => {
    return val === undefined || val === null;
  };

  static sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  static css = (element: any, style: { [key: string]: string }) => {
    for (const property in style) element.style[property] = style[property];
  };
}

export default JSHelpers;
