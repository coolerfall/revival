/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */

import { Chain, Interceptor } from "../packages/revival/src/interceptor";
import { ReviRequest } from "../packages/revival/src/request";
import { ReviResponse } from "../packages/revival/src/response";
import { RevivalHeaders } from "../packages/revival/src/headers";

export class LogInterceptor implements Interceptor {
  intercept(chain: Chain): ReviResponse {
    let request: ReviRequest = chain.request();

    console.log(`--> ${request.method} ${request.url}`);
    this.logHeaders(request.headers);

    if (request.params) {
      console.log(request.params);
    }

    let response: ReviResponse;
    try {
      response = chain.proceed(request);
    } catch (e) {
      console.error("<-- HTTP FAILED: ", e, "\n");
      throw e;
    }

    this.logHeaders(response.headers);

    if (response.body) {
      console.log(response.body);
    }

    console.log(`--> END ${request.method} ${request.url}\n`);

    return response;
  }

  private logHeaders(headers: RevivalHeaders): void {
    if (!headers) {
      return;
    }

    headers.forEach(((name, values) => {
      console.log(`${name}: ${values}`);
    }));
  }
}
