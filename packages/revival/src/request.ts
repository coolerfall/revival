/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as qs from "qs";

/**
 * All supported http method in revival.
 */
export enum Method {
  GET = "GET",
  HEAD = "HEAD",
  DELETE = "DELETE",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH"
}

export interface ReviRequest {
  url: string;
  method: Method;
  headers?: object;
  params?: any;
}

/**
 * A builder to build {@link ReviRequest} to make a request.
 */
export class RequestBuilder {
  private isQuery: boolean;
  private params: any;
  private headers: object = {};
  private contentType: string;

  constructor(
    private url: string,
    private readonly method: Method,
    private readonly isMultiPart: boolean,
    private readonly isFormUrlEncoded: boolean,
    private readonly returnRaw: boolean,
    private readonly args: Array<any>
  ) {
    this.isQuery =
      method === Method.GET ||
      method === Method.DELETE ||
      method === Method.HEAD;

    if (this.isMultiPart) {
      this.contentType = "multipart/form-data";
    } else if (this.isFormUrlEncoded) {
      this.contentType = "application/x-www-form-urlencoded";
    }
  }

  addHeader(headerArray: Array<object>, headers: object): void {
    this.headers = {};
    if (!this.returnRaw) {
      Object.assign(this.headers, {
        Accept: "application/json"
      });
    }
    if (this.contentType) {
      Object.assign(this.headers, { "Content-Type": this.contentType });
    }
    Object.assign(this.headers, headers, this.parseParameter(headerArray));
  }

  addQuery(queryArray: Array<object>): void {
    if (!this.isQuery) {
      return;
    }

    let params: object = this.parseParameter(queryArray);
    let query: string = qs.stringify(params);
    if (query && query.length > 0) {
      this.url = `${this.url}?${query}`;
    }
  }

  addBody(bodyArray: Array<object>): void {
    if (this.isQuery) {
      return;
    }

    this.params = JSON.stringify(this.parseParameter(bodyArray));
  }

  addPart(partArray: Array<object>): void {
    if (this.isQuery || partArray.length === 0) {
      return;
    }

    let params: any = this.parseParameter(partArray);
    let formData: FormData = new FormData();

    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        formData.append(key, params[key]);
      }
    }

    this.params = formData;
  }

  build(): ReviRequest {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      params: this.params
    };
  }

  private parseParameter(paramArray: Array<any>): object {
    let params: any = {};
    paramArray
      .filter((param: { key: string; index: number }) => this.args[param.index])
      .forEach((param: { key: string; index: number }) => {
        let key: string = param.key;
        if (key) {
          let value: any = this.args[param.index];
          if (this.isQuery && value instanceof Object) {
            value = JSON.stringify(value);
          }
          params[key] = value;
        } else {
          Object.assign(params, this.args[param.index]);
        }
      });

    return params;
  }
}
