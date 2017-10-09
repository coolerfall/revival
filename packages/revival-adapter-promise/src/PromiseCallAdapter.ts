import { Call, CallAdapter } from "revival";
import { ReviResponse } from "../../revival/src/ReviResponse";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class PromiseCallAdapter<T> implements CallAdapter<T> {
  private constructor() {}

  static create() {
    new PromiseCallAdapter();
  }

  adapt(call: Call<T>, returnRaw: boolean): any {
    return new Promise(function(
      resolve: <T>(value?: T | PromiseLike<T>) => void,
      reject: <T>(reason?: any) => void
    ) {
      try {
        let response: ReviResponse = call.execute();
        return resolve(returnRaw ? response : response.body);
      } catch (e) {
        return reject(e);
      }
    });
  }
}
