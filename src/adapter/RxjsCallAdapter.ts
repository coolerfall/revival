import { Call } from "../Call";
import { CallAdapter } from "../CallAdapter";
import { Observable } from "rxjs";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RxjsCallAdapter implements CallAdapter {
  adapt(call: Call): Observable<any> {
    try {
      return Observable.of(call.execute().body);
    } catch (e) {
      return Observable.throw(e);
    }
  }
}
