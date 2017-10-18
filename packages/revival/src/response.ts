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

export class HttpError {
  constructor(public readonly errorMsg: string) {}
}
