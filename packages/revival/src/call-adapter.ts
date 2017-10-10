/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Call } from "./call";

/**
 * Call adapter which will adapt response to another type.
 */
export interface CallAdapter<T> {
  adapt(call: Call<T>, returnRaw: boolean): any;
}

/**
 * Default call adapter used in revival.
 */
export class DefaultCallAdapter implements CallAdapter<Call<any>> {
  adapt(call: Call<any>): Call<any> {
    return call;
  }
}