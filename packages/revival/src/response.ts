/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RevivalHeaders } from "./headers";

export class ReviResponse {
  readonly ok: boolean;
  readonly code: number;
  readonly url: string;
  readonly body?: any;
  readonly headers: RevivalHeaders;

  constructor(private readonly builder: ResponseBuilder) {
    this.ok = builder.$ok;
    this.code = builder.$code;
    this.url = builder.$url;
    this.body = builder.$body;
    this.headers = builder.$headers;
  }

  newBuilder(): ResponseBuilder {
    return new ResponseBuilder(this);
  }
}

export class ResponseBuilder {
  $ok: boolean;
  $code: number;
  $url: string;
  $body: any;
  $headers: RevivalHeaders;

  constructor(response?: ReviResponse) {
    if (response) {
      this.$ok = response.ok;
      this.$code = response.code;
      this.$url = response.url;
      this.$body = response.body;
      this.$headers = response.headers;
    } else {
      this.$headers = new RevivalHeaders();
    }
  }

  ok(ok: boolean): ResponseBuilder {
    this.$ok = ok;
    return this;
  }

  code(code: number): ResponseBuilder {
    this.$code = code;
    return this;
  }

  url(url: string): ResponseBuilder {
    this.$url = url;
    return this;
  }

  body(body: any): ResponseBuilder {
    this.$body = body;
    return this;
  }

  headers(headers: RevivalHeaders): ResponseBuilder {
    this.$headers = headers;
    return this;
  }

  /**
   * Sets the header named `name` to `value`. If this request
   * already has any headers with that name, they are all replaced.
   */
  header(name: string, value: string): ResponseBuilder {
    this.$headers.set(name, value);
    return this;
  }

  /**
   * Adds a header with `name` and `value`. This will not replace existed value.
   */
  addHeader(name: string, value: string): ResponseBuilder {
    this.$headers.append(name, value);
    return this;
  }

  build(): ReviResponse {
    return new ReviResponse(this);
  }
}

export interface ResponseHandler {
  handle(handler: (response: ReviResponse) => ReviResponse): ResponseHandler;
}

export class HttpHandler implements ResponseHandler {
  private nextHandler: HttpHandler;
  private handler: (response: ReviResponse) => ReviResponse;
  private onResponse: (response: ReviResponse) => void;
  private calls: number = 0;

  /**
   * Handle response in callback, and return the modified response or the origin response.
   *
   * @param handler handle response and return response
   * @returns a new {@link ResponseHandler}, this should be returned in {@link Interceptor}
   */
  handle(handler: (response: ReviResponse) => ReviResponse): ResponseHandler {
    this.handler = handler;
    this.nextHandler = new HttpHandler();
    return this.nextHandler;
  }

  next(response: ReviResponse): void {
    if (++this.calls !== 1) {
      throw new Error(
        "ResonseHandler returned by `handle` method must return in `Interceptor`."
      );
    }

    let nextResponse: ReviResponse = response;
    if (this.handler) {
      nextResponse = this.handler(response);
    }

    if (this.nextHandler) {
      this.nextHandler.next(nextResponse);
    } else if (this.onResponse) {
      this.onResponse(nextResponse);
    }
  }

  subscribe(onResponse: (response: ReviResponse) => void): void {
    this.onResponse = onResponse;
  }
}

export class HttpError {
  constructor(public readonly errorMsg: string) {}
}
