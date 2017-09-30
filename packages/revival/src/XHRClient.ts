import { CallFactory } from "./CallFactory";
import { ReviRequest } from "./ReviRequest";
import { Call } from "./Call";
import { RealCall } from "./RealCall";
import { Interceptor } from "./Interceptor";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class XHRClient implements CallFactory {
  constructor(readonly interceptors: Array<Interceptor>) {}

  newCall(request: ReviRequest): Call {
    return new RealCall(this, request);
  }
}
