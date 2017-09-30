import { Chain } from "./Chain";
import { Interceptor } from "./Interceptor";
import { ReviRequest } from "./ReviRequest";
import { ReviResponse } from "./ReviResponse";
import { DUMMY } from "./dummy";

/**
 * A implementation for {@link Chain} to go through all the {@link Interceptor}s.
 *
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RealInterceptorChain implements Chain {
  private calls: number = 0;

  constructor(
    private readonly interceptors: Array<Interceptor>,
    private readonly index: number,
    private readonly pureRequest: ReviRequest
  ) {}

  request(): ReviRequest {
    return this.pureRequest;
  }

  proceed(request: ReviRequest): ReviResponse {
    if (!request) {
      throw new Error("Request in interceptor chain must not be null.");
    }

    if (this.index >= this.interceptors.length) {
      return DUMMY;
    }

    this.calls++;

    let next: RealInterceptorChain = new RealInterceptorChain(
      this.interceptors,
      this.index + 1,
      request
    );
    let interceptor: Interceptor = this.interceptors[this.index];
    let response: ReviResponse = interceptor.intercept(next);
    if (this.index + 1 < this.interceptors.length && next.calls != 1) {
      throw Error(
        "Revival interceptor " +
          interceptor +
          " must call proceed() exactly once."
      );
    }

    return response;
  }
}
