import { ReviRequest } from "./ReviRequest";
import { ReviResponse } from "./ReviResponse";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface Chain {
  request(): ReviRequest;
  proceed(request: ReviRequest): ReviResponse;
}
