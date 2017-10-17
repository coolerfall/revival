/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import "reflect-metadata";
import { Revival } from "../revival";
import { RequestBuilder, Method } from "../request";

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
      let returnRaw: boolean = target[`${propertyKey}_Return_Raw`];
      let builder: RequestBuilder = new RequestBuilder(
        revival,
        method,
        isMultiPart,
        isFormUrlEncoded,
        returnRaw,
        args
      );

      let headerArray: Array<object> =
        target[`${propertyKey}_Header_Parameters`] || [];
      let queryArray: Array<object> =
        target[`${propertyKey}_Query_Parameters`] || [];
      let pathArray: Array<object> =
        target[`${propertyKey}_Path_Parameters`] || [];
      let bodyArray: Array<object> =
        target[`${propertyKey}_Body_Parameters`] || [];
      let partArray: Array<object> =
        target[`${propertyKey}_Part_Parameters`] || [];

      check(method, queryArray, bodyArray, partArray);

      builder
        .addPath(path, pathArray)
        .addHeader(headerArray, target[`${propertyKey}_Headers`])
        .addQuery(queryArray)
        .addBody(bodyArray)
        .addPart(partArray);

      let returnType: any = Reflect.getMetadata(
        "design:returntype",
        target,
        propertyKey
      );

      return revival.call(builder.build(), returnType.name, returnRaw);
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
