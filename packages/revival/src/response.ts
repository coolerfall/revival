/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RevivalHeaders } from "./headers";
import { checkNotNull } from "./utils";

export interface ReviResponse {
  ok: boolean;
  code: number;
  url: string;
  body: any;
  headers: RevivalHeaders;
}

export interface ResponseHandler {
  enqueue(
    onResponse: (response: ReviResponse) => void,
    onFailure: (error: any) => void
  ): void;
}

export class RevivalResponseHandler implements ResponseHandler {
  private readonly successHandlers: Array<
    (response: ReviResponse) => void
  > = [];
  private readonly failureHandlers: Array<(error: any) => void> = [];

  enqueue(
    onResponse: (response: ReviResponse) => void,
    onFailure: (error: any) => void
  ): void {
    this.successHandlers.push(checkNotNull(onResponse, "onResponse === null"));
    this.failureHandlers.push(checkNotNull(onFailure, "onFailure === null"));
  }

  handleResponse(response: ReviResponse) {
    this.successHandlers.forEach(
      (onResponse: (response: ReviResponse) => void) => {
        onResponse(response);
      }
    );
  }

  handleError(error: any) {
    this.failureHandlers.forEach((onFailure: (error: any) => void) => {
      onFailure(error);
    });
  }
}

export class HttpError {
  constructor(public readonly errorMsg: string) {}
}
