import { Call, CallAdapter } from "revival";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class PromiseCallAdapter implements CallAdapter {
  private constructor() {}

  static create() {
    new PromiseCallAdapter();
  }

  adapt(call: Call): Promise<any> {
    return new Promise(function(
      resolve: <T>(value?: T | PromiseLike<T>) => void,
      reject: <T>(reason?: any) => void
    ) {
      try {
        return resolve(call.execute().body);
      } catch (e) {
        return reject(e);
      }
    });
  }
}
