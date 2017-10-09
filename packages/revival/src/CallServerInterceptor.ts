import { Chain } from "./Chain";
import { Client } from "./Client";
import { Interceptor } from "./Interceptor";
import { ReviResponse } from "./ReviResponse";

/**
 * This is the final {@link Interceptor} to call server and get response.
 *
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class CallServerInterceptor implements Interceptor {
  constructor(private readonly client: Client) {}

  intercept(chain: Chain): ReviResponse {
    return this.client.execute(chain.request());
  }
}
