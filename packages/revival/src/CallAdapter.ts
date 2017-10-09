import { Call } from "./Call";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface CallAdapter<T> {
  adapt(call: Call<T>, returnRaw: boolean): T;
}
