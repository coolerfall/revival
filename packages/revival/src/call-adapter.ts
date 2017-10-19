/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Call } from "./call";
import { ReviRequest } from "./request";
import { ReviResponse } from "./response";

/**
 * Call adapter which will adapt response to another type.
 */
export interface CallAdapter<T> {
  check(returnType: string): boolean;

  adapt(call: Call<T>, returnRaw: boolean): any;
}

/**
 * Default call adapter used in revival.
 */
export class DefaultCallAdapter implements CallAdapter<Call<any>> {
  check(returnType: string): boolean {
    return returnType === "Object";
  }

  adapt(call: Call<any>, returnRaw: boolean): Call<any> {
    return new RawCall(call, returnRaw);
  }
}

class RawCall implements Call<any> {
  constructor(
    private readonly originCall: Call<any>,
    private readonly returnRaw: boolean
  ) {}

  request(): ReviRequest {
    return this.originCall.request();
  }

  enqueue(
    onResponse?: (response: ReviResponse) => void,
    onFailure?: (error: any) => void
  ): void {
    this.originCall.enqueue(
      response =>
        onResponse && onResponse(this.returnRaw ? response : response.body),
      error => onFailure && onFailure(error)
    );
  }

  cancel(): void {
    this.originCall.cancel();
  }
}
