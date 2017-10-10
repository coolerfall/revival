import { Call, CallFactory } from "./Call";
import { ReviRequest } from "./ReviRequest";
import { Interceptor } from "./Interceptor";
import { RealCall } from "./RealCall";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RevivalCallFactory implements CallFactory {
  private readonly interceptors: Array<Interceptor> = [];

  constructor(interceptors?: Array<Interceptor>) {
    if (interceptors) {
      this.interceptors.push(...interceptors);
    }
  }

  newCall(request: ReviRequest): Call<any> {
    return new RealCall(request, this.interceptors);
  }
}
