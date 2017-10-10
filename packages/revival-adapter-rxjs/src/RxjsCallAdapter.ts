import { Call, CallAdapter, ReviResponse } from "revival";
import { Observable } from "rxjs";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RxjsCallAdapter<T> implements CallAdapter<T> {
  private constructor() {}

  static create() {
    return new RxjsCallAdapter();
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
