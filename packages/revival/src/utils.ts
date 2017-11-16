/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function checkNotNull<T>(value: T, message: string): T {
  if (!value) {
    throw new Error(message);
  }

  return value;
}
