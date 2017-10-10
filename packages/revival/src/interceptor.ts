/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */

import { ReviResponse } from "./ReviResponse";
import { ReviRequest } from "./ReviRequest";

export interface Chain {
  request(): ReviRequest;
  proceed(request: ReviRequest): ReviResponse;
}

export interface Interceptor {
  intercept(chain: Chain): ReviResponse;
}
