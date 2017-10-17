import { Call, CallAdapter, ReviResponse } from "revival";

/**
 * A {@link CallAdapter} implemented by {@link Promise}.
 *
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class PromiseCallAdapter<T> implements CallAdapter<T> {
  private constructor() {}

  static create(): CallAdapter<any> {
    return new PromiseCallAdapter();
  }

  check(returnType: string): boolean {
    return returnType === "Promise";
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
