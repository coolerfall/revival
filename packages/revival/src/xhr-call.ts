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
  HttpHandler,
  ResponseBuilder,
  ResponseHandler,
  ReviResponse
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
    try {
      (this.getResponseWithInterceptors() as HttpHandler).subscribe(
        response => {
          if (response.code < 200 || response.code >= 300) {
            if (onFailure) {
              onFailure(new HttpError(response));
            }
          } else {
            if (onResponse) {
              onResponse(response);
            }
          }
        }
      );
    } catch (e) {
      if (onFailure) {
        onFailure(e);
      }
    }
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
 * This is the final {@link Interceptor} to call server and get callback.
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

    if (!(request.headers instanceof RevivalHeaders)) {
      throw new Error("The headers in request must bt 'RevivalHeaders'");
    }

    /* add all headers */
    request.headers.forEach((name, values) => {
      xhr.setRequestHeader(name, values.join(","));
    });
    /* add an Accept if headers is not present */
    if (!request.headers.has("Accept")) {
      xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
    }

    let handler = new HttpHandler();

    xhr.addEventListener("load", () => {
      if (xhr.readyState === 4) {
        let response = this.getResponse(request, xhr);
        handler.next(response);
      }
    });
    xhr.addEventListener("error", () => {
      handler.next(this.getResponse(request, xhr));
    });
    xhr.send(request.params);

    return handler;
  }

  private getResponse(request: ReviRequest, xhr: XMLHttpRequest): ReviResponse {
    let status = xhr.status;
    let ok = !(status < 200 || status >= 300);

    let response: any =
      typeof xhr.response === "undefined" ? xhr.responseText : xhr.response;

    let revivalResponse: ReviResponse = new ResponseBuilder()
      .ok(ok)
      .code(status)
      .url(xhr.responseURL || request.url)
      .body(response)
      .headers(new RevivalHeaders(xhr.getAllResponseHeaders()))
      .build();

    return revivalResponse;
  }
}
