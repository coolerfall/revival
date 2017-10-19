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
import {
  HttpError,
  ReviResponse,
  ResponseHandler,
  RevivalResponseHandler
} from "./response";

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

  enqueue(
    onResponse?: (response: ReviResponse) => void,
    onFailure?: (error: any) => void
  ): void {
    this.getResponseWithInterceptors().enqueue(
      response => {
        if (onResponse) {
          onResponse(response);
        }
      },
      error => {
        if (onFailure) {
          onFailure(error);
        }
      }
    );
  }

  cancel(): void {}

  private getResponseWithInterceptors(): ResponseHandler {
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
  intercept(chain: Chain): ResponseHandler {
    return this.execute(chain.request());
  }

  execute(request: ReviRequest): ResponseHandler {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open(request.method, request.url, true);
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

    let handler = new RevivalResponseHandler();

    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        let status = xhr.status;
        let ok: boolean = false;
        if (status < 200 || status >= 300) {
          handler.handleError(new HttpError(xhr.statusText || "Unkown Error"));
        } else {
          ok = true;
        }

        let response: any =
          typeof xhr.response === "undefined" ? xhr.responseText : xhr.response;

        let realResponse: ReviResponse = {
          ok: ok,
          code: xhr.status,
          url: xhr.responseURL || request.url,
          body: response,
          headers: new RevivalHeaders(xhr.getAllResponseHeaders())
        };
        handler.handleResponse(realResponse);
      }
    });
    xhr.addEventListener("error", (event: ErrorEvent) => {
      handler.handleError(event.error);
    });
    xhr.send(request.params);

    return handler;
  }
}
