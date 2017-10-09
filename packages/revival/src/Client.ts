import { ReviResponse } from "./ReviResponse";
import { ReviRequest } from "./ReviRequest";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface Client {
  execute(request: ReviRequest): ReviResponse;
}
