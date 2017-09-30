import { Call } from "./Call";
import { ReviRequest } from "./ReviRequest";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface CallFactory {
  newCall(request: ReviRequest): Call;
}
