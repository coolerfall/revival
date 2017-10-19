import { Call, CallAdapter } from "revival";

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
        call.enqueue(
          response => resolve(returnRaw ? response : response.body),
          error => reject(error)
        );
      } catch (e) {
        return reject(e);
      }
    });
  }
}
