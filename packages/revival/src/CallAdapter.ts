import { Call } from "./Call";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface CallAdapter {
  adapt(call: Call): any;
}
