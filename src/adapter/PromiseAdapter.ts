/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
import { CallAdapter } from "../CallAdapter";
import { Call } from "../Call";

export class PromiseAdapter implements CallAdapter {
  adapt(call: Call): Promise<any> {
    try {
      return Promise.resolve(call.execute().body);
    } catch (e) {
      return Promise.resolve(e);
    }
  }
}
