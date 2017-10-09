import { CallFactory } from "./CallFactory";
import { ReviRequest } from "./ReviRequest";
import { Call } from "./Call";
import { RealCall } from "./RealCall";
import { Interceptor } from "./Interceptor";
import {Client} from "./Client";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RevivalCallFactory implements CallFactory {
  interceptors: Array<Interceptor> = [];

  constructor(readonly client: Client, interceptors?: Array<Interceptor>) {
    if (interceptors) {
      this.interceptors.push(...interceptors);
    }
  }

  newCall(request: ReviRequest): Call<any> {
    return new RealCall(this, request);
  }
}
