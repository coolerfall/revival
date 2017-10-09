import { Call } from "./Call";
import { CallAdapter } from "./CallAdapter";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class DefaultCallAdapter implements CallAdapter<Call<any>> {
  adapt(call: Call<any>): Call<any> {
    return call;
  }
}
