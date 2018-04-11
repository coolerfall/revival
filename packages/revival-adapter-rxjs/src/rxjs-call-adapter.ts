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

  check(returnType: string): boolean {
    return returnType === "Observable";
  }

  adapt(call: Call<T>, returnRaw: boolean): any {
    return Observable.create((observer: Observer<any>) => {
      try {
        call.enqueue(
          response => observer.next(returnRaw ? response : response.body),
          error => observer.error(error)
        );
      } catch (e) {
        return observer.error(e);
      }
    });
  }
}
