import { Call, CallAdapter } from "revival";
import { Observable } from "rxjs";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RxjsCallAdapter implements CallAdapter {
  private constructor() {}

  static create() {
    return new RxjsCallAdapter();
  }

  adapt(call: Call): Observable<any> {
    return Observable.defer(() => {
      try {
        return Observable.of(call.execute().body);
      } catch (e) {
        return Observable.throw(e);
      }
    })
  }
}
