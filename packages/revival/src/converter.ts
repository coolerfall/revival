/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ReviResponse } from "./response";

/**
 * A converter to convert response to the specified type.
 */
export interface Converter {
  convert(value: ReviResponse): ReviResponse;
}

/**
 * Built in json converter used in revival.
 */
export class BuiltInJsonConverter implements Converter {
  convert(value: ReviResponse): any {
    return Object.assign({}, value, { body: JSON.parse(value.body) });
  }
}
