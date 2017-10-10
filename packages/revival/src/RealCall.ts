import { Call } from "./Call";
import { CallServerInterceptor } from "./CallServerInterceptor";
import { Chain, Interceptor } from "./Interceptor";
import { ReviRequest } from "./ReviRequest";
import { ReviResponse } from "./ReviResponse";
import { RealInterceptorChain } from "./RealInterceptorChain";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RealCall implements Call<any> {
  constructor(
    private readonly originRequest: ReviRequest,
    private readonly interceptors: Array<Interceptor>
  ) {}

  request(): ReviRequest {
    return this.originRequest;
  }

  execute(): ReviResponse {
    return this.getResponseWithInterceptors();
  }

  enqueue(
    onResponse: (response: ReviResponse) => void,
    onFailure: () => void
  ): void {
    new AsyncCall(
      this.getResponseWithInterceptors,
      onResponse,
      onFailure
    ).execute();
  }

  private getResponseWithInterceptors(): ReviResponse {
    let interceptors: Array<Interceptor> = [];
    interceptors.push(...this.interceptors);
    interceptors.push(new CallServerInterceptor());

    let chain: Chain = new RealInterceptorChain(
      interceptors,
      0,
      this.originRequest
    );
    return chain.proceed(this.originRequest);
  }
}

class AsyncCall {
  constructor(
    private readonly getResponseWithInterceptors: () => ReviResponse,
    private readonly onResponse?: (response: ReviResponse) => void,
    private readonly onFailure?: () => void
  ) {}
  execute(): void {
    setTimeout(() => {
      try {
        let response: ReviResponse = this.getResponseWithInterceptors();
        this.onResponse && this.onResponse(response);
      } catch (e) {
        this.onFailure && this.onFailure();
      }
    }, 0);
  }
}
