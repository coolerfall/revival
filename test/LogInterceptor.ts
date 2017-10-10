/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */

import { Chain, Interceptor } from "../packages/revival/src/interceptor";
import { ReviRequest } from "../packages/revival/src/request";
import { ReviResponse } from "../packages/revival/src/response";

export class LogInterceptor implements Interceptor {
  intercept(chain: Chain): ReviResponse {
    let request: ReviRequest = chain.request();

    console.log(`--> ${request.method} ${request.url}`);
    this.logHeaders(request.headers);

    if (request.params) {
      console.log(request.params);
    }

    let response: ReviResponse = chain.proceed(request);
    this.logHeaders(response.headers);

    if (response.body) {
      console.log(response.body);
    }

    console.log(`--> END ${request.method} \n`);

    return response;
  }

  private logHeaders(headers: any): void {
    if (!headers) {
      return;
    }

    for (let key in headers) {
      if (headers.hasOwnProperty(key)) {
        console.log(`${key}: ${headers[key]}`);
      }
    }
  }
}
