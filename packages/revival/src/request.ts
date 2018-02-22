/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as qs from "qs";
import { RevivalHeaders } from "./headers";
import { Revival } from "./revival";

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
  headers: RevivalHeaders;
  withCredentials?: boolean;
  params?: any;
}

/**
 * A builder to build {@link ReviRequest} to make a request.
 */
export class RequestBuilder {
  private readonly headers: RevivalHeaders = new RevivalHeaders();
  private url: string;
  private isQuery: boolean;
  private params: any;
  private contentType: string;

  constructor(
    private readonly revival: Revival,
    private readonly method: Method,
    private readonly isMultiPart: boolean,
    private readonly isFormUrlEncoded: boolean,
    private readonly returnRaw: boolean,
    private readonly withCredentials: boolean,
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

  addPath(path: string, pathArray: Array<object>): RequestBuilder {
    let pathRegExpArray = path.match(/{[a-zA-Z][a-zA-Z0-9_-]*}/gi);
    if (pathRegExpArray) {
      let paths: any = this.parseParameter(pathArray);
      pathRegExpArray.forEach(regExp => {
        let key = regExp.replace(/^{|}/gi, "");
        path = path.replace(regExp, paths[key]);
      });
    }
    this.url = this.revival.fullUrl(path);
    return this;
  }

  addHeader(headerArray: Array<object>, headers: string[]): RequestBuilder {
    if (!this.returnRaw) {
      this.headers.append("Accept", "application/json");
    }

    if (this.contentType) {
      this.headers.append("Content-Type", this.contentType);
    }

    headers.forEach(header => {
      let colon = header.indexOf(":");
      if (colon === -1 || colon === 0 || colon === header.length - 1) {
        throw new Error(
          `@Headers value must be in the form \"Name: Value\". Found: ${header}`
        );
      }

      let headerName = header.substring(0, colon);
      let headerValue = header.substring(colon + 1).trim();
      this.headers.set(headerName, headerValue);
    });

    let overrideHeaders: any = this.parseParameter(headerArray);
    for (let key in overrideHeaders) {
      if (overrideHeaders.hasOwnProperty(key)) {
        this.headers.set(key, overrideHeaders[key]);
      }
    }

    return this;
  }

  addQuery(queryArray: Array<object>): RequestBuilder {
    if (!this.isQuery) {
      return this;
    }

    let params: object = this.parseParameter(queryArray);
    let query: string = qs.stringify(params);
    if (query && query.length > 0) {
      this.url = `${this.url}?${query}`;
    }

    return this;
  }

  addBody(bodyArray: Array<object>): RequestBuilder {
    if (this.isQuery) {
      return this;
    }

    let parsedParams = this.parseParameter(bodyArray);
    if (this.isFormUrlEncoded) {
      this.params = qs.stringify(parsedParams);
    } else {
      this.params = this.revival.serializer().convert(parsedParams);
    }

    return this;
  }

  addPart(partArray: Array<object>): RequestBuilder {
    if (this.isQuery || partArray.length === 0 || !this.isMultiPart) {
      return this;
    }

    let params: any = this.parseParameter(partArray);
    let formData: FormData = new FormData();

    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        formData.append(key, params[key]);
      }
    }

    this.params = formData;

    return this;
  }

  build(): ReviRequest {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      params: this.params,
      withCredentials: this.withCredentials
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
            throw new Error("Query parameters should not be object.");
          }
          params[key] = value;
        } else {
          Object.assign(params, this.args[param.index]);
        }
      });

    return params;
  }
}
