import { Call, CallAdapter } from "revival";
import { Observable, Observer } from "rxjs";

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

  check(returnType: any): boolean {
    return returnType.prototype === Observable.prototype;
  }

  adapt(call: Call<T>, returnRaw: boolean): any {
    return Observable.create((observer: Observer<any>) => {
      try {
        call.enqueue(
          response => observer.next(returnRaw ? response : response.body),
          error => Observable.throw(error)
        );
      } catch (e) {
        return Observable.throw(e);
      }
    });
  }
}
