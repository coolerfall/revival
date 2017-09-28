/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */

import { Method } from "../Method";
import { Revival } from "../Revival";
import { RequestBuilder } from "../RequestBuilder";

export function methodDecorator(method: Method, path: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    descriptor.value = function(...args: any[]) {
      let revival: Revival = target["Api_Revival"];
      if (!revival) {
        throw new Error("Api should be created by Rxfetch.create(ApiClazz).");
      }

      let isMultiPart: boolean = target[`${propertyKey}_MultiPart`];
      let isFormUrlEncoded: boolean = target[`${propertyKey}_FormUrlEncoded`];
      let builder: RequestBuilder = new RequestBuilder(
        revival.fullUrl(path),
        method,
        isMultiPart,
        isFormUrlEncoded,
        args
      );

      let headerArray: Array<object> =
        target[`${propertyKey}_Header_Parameters`] || [];
      let queryArray: Array<object> =
        target[`${propertyKey}_Query_Parameters`] || [];
      let bodyArray: Array<object> =
        target[`${propertyKey}_Body_Parameters`] || [];
      let partArray: Array<object> =
        target[`${propertyKey}_Part_Parameters`] || [];

      check(method, queryArray, bodyArray, partArray);

      builder.addHeader(headerArray, target[`${propertyKey}_Headers`]);
      builder.addQuery(queryArray);
      builder.addBody(bodyArray);
      builder.addPart(partArray);

      return revival.call(builder.build(), target[`${propertyKey}_Return_Raw`]);
    };

    return descriptor;
  };
}

function check(
  method: Method,
  queryArray: Array<object>,
  bodyArray: Array<object>,
  partArray: Array<object>
) {
  if (
    method === Method.GET ||
    method === Method.DELETE ||
    method === Method.HEAD
  ) {
    if (bodyArray.length > 0 || partArray.length > 0) {
      throw new Error(`@${method} decorator cannot have body.`);
    }
  } else {
    if (bodyArray.length === 0 && partArray.length === 0) {
      throw new Error(`@${method} decorator must have body.`);
    }
    if (queryArray.length > 0) {
      throw new Error(`@${method} decorator cannot have query.`);
    }
  }
}
