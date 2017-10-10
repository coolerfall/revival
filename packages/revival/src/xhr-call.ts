/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Call } from "./call";
import { Chain, Interceptor, RealInterceptorChain } from "./interceptor";
import { ReviRequest } from "./request";
import { HttpError, ReviResponse } from "./response";

/**
 * A {@link Call} implemented by XMLHttpRequest.
 */
export class XhrCall implements Call<any> {
  constructor(
    private readonly originRequest: ReviRequest,
    private readonly interceptors: Array<Interceptor>
  ) {}

  request(): ReviRequest {
    return this.originRequest;
  }

  execute(): ReviResponse {
    return this.getResponseWithInterceptors();
  }

  enqueue(
    onResponse: (response: ReviResponse) => void,
    onFailure: () => void
  ): void {
    new AsyncXhrCall(
      this.getResponseWithInterceptors,
      onResponse,
      onFailure
    ).execute();
  }

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
    xhr.send(request.params);

    if (xhr.status < 200 || xhr.status >= 300) {
      throw new HttpError();
    }

    let response: any =
      typeof xhr.response === "undefined" ? xhr.responseText : xhr.response;

    return {
      body: response,
      headers: this.parseResponseHeaders(xhr.getAllResponseHeaders())
    };
  }

  parseResponseHeaders(allHeaders: string) {
    let headers: any = {};
    if (!allHeaders) {
      return headers;
    }
    let headerPairs = allHeaders.split("\u000d\u000a");
    for (let i = 0, len = headerPairs.length; i < len; i++) {
      let headerPair = headerPairs[i];
      let index = headerPair.indexOf("\u003a\u0020");
      if (index > 0) {
        let key = headerPair.substring(0, index);
        headers[key] = headerPair.substring(index + 2);
      }
    }
    return headers;
  }
}

class AsyncXhrCall {
  constructor(
    private readonly getResponseWithInterceptors: () => ReviResponse,
    private readonly onResponse?: (response: ReviResponse) => void,
    private readonly onFailure?: () => void
  ) {}
  execute(): void {
    setTimeout(() => {
      try {
        let response: ReviResponse = this.getResponseWithInterceptors();
        this.onResponse && this.onResponse(response);
      } catch (e) {
        this.onFailure && this.onFailure();
      }
    }, 0);
  }
}
