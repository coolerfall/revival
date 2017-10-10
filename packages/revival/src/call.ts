/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */

import { ReviResponse } from "./ReviResponse";
import { ReviRequest } from "./ReviRequest";

export interface Call<T> {
  request(): ReviRequest;
  execute(): ReviResponse;
  enqueue(
    onResponse?: (response: ReviResponse) => void,
    onFailure?: () => void
  ): void;
}

export interface CallFactory {
  newCall(request: ReviRequest): Call<any>;
}