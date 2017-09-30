import { Chain } from "./Chain";
import { ReviResponse } from "./ReviResponse";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface Interceptor {
  intercept(chain: Chain): ReviResponse;
}
