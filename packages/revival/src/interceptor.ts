/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { DUMMY } from "./dummy";
import { ReviRequest } from "./request";
import { ResponseHandler } from "./response";

export interface Chain {
  request(): ReviRequest;

  proceed(request: ReviRequest): ResponseHandler;
}

export interface Interceptor {
  intercept(chain: Chain): ResponseHandler;
}

/**
 * A implementation for {@link Chain} to go through all the {@link Interceptor}s.
 */
export class RealInterceptorChain implements Chain {
  private calls: number = 0;

  constructor(
    private readonly interceptors: Array<Interceptor>,
    private readonly index: number,
    private readonly originRequest: ReviRequest
  ) {}

  request(): ReviRequest {
    return this.originRequest;
  }

  proceed(request: ReviRequest): ResponseHandler {
    if (!request) {
      throw new Error("Request in interceptor chain must not be null.");
    }

    if (this.index >= this.interceptors.length) {
      return DUMMY;
    }

    this.calls++;

    let next: RealInterceptorChain = new RealInterceptorChain(
      this.interceptors,
      this.index + 1,
      request
    );
    let interceptor: Interceptor = this.interceptors[this.index];
    let handler: ResponseHandler = interceptor.intercept(next);
    if (this.index + 1 < this.interceptors.length && next.calls !== 1) {
      throw Error(
        "Revival interceptor " +
          interceptor +
          " must call proceed() exactly once."
      );
    }

    return handler;
  }
}
