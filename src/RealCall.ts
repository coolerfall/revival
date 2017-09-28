import { Call } from "./Call";
import { ReviRequest } from "./ReviRequest";
import { ReviResponse } from "./ReviResponse";
import { Callback } from "./Callback";
import { XHRClient } from "./XHRClient";
import { RealInterceptorChain } from "./RealInterceptorChain";
import { Chain } from "./Chain";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RealCall implements Call {
  constructor(
    private readonly client: XHRClient,
    private readonly originRequest: ReviRequest
  ) {}

  request(): ReviRequest {
    return this.originRequest;
  }

  execute(): ReviResponse {
    return this.getResponseWithInterceptors();
  }

  enqueue(callback: Callback): void {
    throw new Error("Method not implemented.");
  }

  getResponseWithInterceptors(): ReviResponse {
    let chain: Chain = new RealInterceptorChain(
      this.client.interceptors,
      0,
      this.originRequest
    );
    return chain.proceed(this.originRequest);
  }
}
