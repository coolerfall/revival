import { Call, CallAdapter, ReviResponse } from "revival";
import { Observable } from "rxjs";

/**
 * A {@link CallAdapter} implemented by rxjs.
 *
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RxjsCallAdapter<T> implements CallAdapter<T> {
  private constructor() {}

  static create(): CallAdapter<any> {
    return new RxjsCallAdapter();
  }

  check(returnType: string): boolean {
    return returnType === "Observable";
  }

  adapt(call: Call<T>, returnRaw: boolean): any {
    return Observable.defer(() => {
      try {
        let response: ReviResponse = call.execute();
        return Observable.of(returnRaw ? response : response.body);
      } catch (e) {
        return Observable.throw(e);
      }
    });
  }
}
