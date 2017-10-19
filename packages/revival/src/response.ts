/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RevivalHeaders } from "./headers";

export interface ReviResponse {
  code: number;
  url: string;
  body: any;
  headers: RevivalHeaders;
}

export interface ResponseHandler {
  responseHandler(): ((response: ReviResponse) => void) | undefined | null;
  falureHandler(): ((error: any) => void) | undefined | null;

  enqueue(
    onResponse?: (response: ReviResponse) => void,
    onFailure?: (error: any) => void
  ): void;
}

export class RevivalResponseHandler implements ResponseHandler {
  private onResponse?: (response: ReviResponse) => void;
  private onFailure?: (error: any) => void;

  responseHandler(): ((response: ReviResponse) => void) | undefined | null {
    return this.onResponse;
  }

  falureHandler(): ((error: any) => void) | undefined | null {
    return this.onFailure;
  }

  enqueue(
    onResponse?: (response: ReviResponse) => void,
    onFailure?: (error: any) => void
  ): void {
    this.onResponse = onResponse;
    this.onFailure = onFailure;
  }

  handleResponse(response: ReviResponse) {
    if (!this.onResponse) {
      return;
    }
    this.onResponse(response);
  }

  handleError(error: any) {
    if (!this.onFailure) {
      return;
    }
    this.onFailure(error);
  }
}

export class HttpError {
  constructor(public readonly errorMsg: string) {}
}
