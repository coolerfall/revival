import { Callback } from "./Callback";
import { ReviResponse } from "./ReviResponse";
import { ReviRequest } from "./ReviRequest";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface Call {
  request(): ReviRequest;
  execute(): ReviResponse;
  enqueue(callback: Callback): void;
}
