import { Interceptor } from "./Interceptor";
import { Chain } from "./Chain";
import { ReviRequest } from "./ReviRequest";
import { ReviResponse } from "./ReviResponse";
import { HttpError } from "./HttpError";

/**
 * This is the final {@link Interceptor} to call server and get response.
 *
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class CallServerInterceptor implements Interceptor {
  intercept(chain: Chain): ReviResponse {
    let request: ReviRequest = chain.request();

    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open(request.method, request.url, false);
    xhr.send(request.params);

    if (xhr.status !== 200) {
      throw new HttpError();
    }

    let response: any = xhr.response;

    return {
      body: response,
      headers: this.parseResponseHeaders(xhr.getAllResponseHeaders())
    };
  }

  parseResponseHeaders(allHeaders: string) {
    let headers: any = {};
    if (!allHeaders) {
      return headers;
    }
    let headerPairs = allHeaders.split("\u000d\u000a");
    for (let i = 0, len = headerPairs.length; i < len; i++) {
      let headerPair = headerPairs[i];
      let index = headerPair.indexOf("\u003a\u0020");
      if (index > 0) {
        let key = headerPair.substring(0, index);
        headers[key] = headerPair.substring(index + 2);
      }
    }
    return headers;
  }
}
