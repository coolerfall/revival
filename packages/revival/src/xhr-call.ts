/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Call } from "./call";
import { Chain, Interceptor, RealInterceptorChain } from "./interceptor";
import { ReviRequest } from "./request";
import { RevivalHeaders } from "./headers";
import { HttpError, ReviResponse } from "./response";

/**
 * A {@link Call} implemented by XMLHttpRequest.
 */
export class XhrCall implements Call<any> {
  constructor(
    private readonly originRequest: ReviRequest,
    private readonly interceptors: Array<Interceptor>
  ) {
    this.getResponseWithInterceptors = this.getResponseWithInterceptors.bind(
      this
    );
  }

  request(): ReviRequest {
    return this.originRequest;
  }

  execute(): ReviResponse {
    return this.getResponseWithInterceptors();
  }

  enqueue(
    onResponse?: (response: ReviResponse) => void,
    onFailure?: (error: any) => void
  ): void {
    new AsyncXhrCall(
      this.getResponseWithInterceptors,
      onResponse,
      onFailure
    ).execute();
  }

  cancel(): void {}

  private getResponseWithInterceptors(): ReviResponse {
    let interceptors: Array<Interceptor> = [];
    interceptors.push(...this.interceptors);
    interceptors.push(new CallServerInterceptor());

    let chain: Chain = new RealInterceptorChain(
      interceptors,
      0,
      this.originRequest
    );
    return chain.proceed(this.originRequest);
  }
}

/**
 * This is the final {@link Interceptor} to call server and get response.
 */
class CallServerInterceptor implements Interceptor {
  intercept(chain: Chain): ReviResponse {
    return this.execute(chain.request());
  }

  execute(request: ReviRequest): ReviResponse {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open(request.method, request.url, false);
    if (request.withCredentials) {
      xhr.withCredentials = true;
    }
    /* add all headers */
    request.headers.forEach((name, values) => {
      xhr.setRequestHeader(name, values.join(","));
    });
    /* add an Accept if headers is not present */
    if (!request.headers.has("Accept")) {
      xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
    }
    xhr.send(request.params);

    if (xhr.status < 200 || xhr.status >= 300) {
      throw new HttpError(xhr.statusText || "Unkown Error");
    }

    let response: any =
      typeof xhr.response === "undefined" ? xhr.responseText : xhr.response;

    return {
      code: xhr.status,
      url: xhr.responseURL || request.url,
      body: response,
      headers: new RevivalHeaders(xhr.getAllResponseHeaders())
    };
  }
}

/**
 * Asynchronously XMLHttpRequest call for enqueue.
 */
class AsyncXhrCall {
  constructor(
    private readonly getResponseWithInterceptors: () => ReviResponse,
    private readonly onResponse?: (response: ReviResponse) => void,
    private readonly onFailure?: (error: any) => void
  ) {}

  execute(): void {
    setTimeout(() => {
      try {
        let response: ReviResponse = this.getResponseWithInterceptors();
        if (this.onResponse) {
          this.onResponse(response);
        }
      } catch (e) {
        if (this.onFailure) {
          this.onFailure(e);
        }
      }
    }, 0);
  }
}
