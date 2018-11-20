import {
  Chain,
  Interceptor,
  ResponseHandler,
  ReviRequest,
  RevivalHeaders
} from "revival";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class LogInterceptor implements Interceptor {
  intercept(chain: Chain): ResponseHandler {
    let request: ReviRequest = chain.request();

    console.log(`--> ${request.method} ${request.url}`);
    this.logHeaders(request.headers);

    if (request.params) {
      console.log(request.params);
    }

    let handler: ResponseHandler;
    try {
      handler = chain.proceed(request);
      handler = handler.handle(response => {
        this.logHeaders(response.headers);
        if (response.body) {
          console.log(response.body);
        }
        console.log(`--> END ${request.method} ${request.url}\n`);
        return response;
      });
    } catch (e) {
      console.error("<-- HTTP FAILED: ", e, "\n");
      throw e;
    }

    return handler;
  }

  private logHeaders(headers: RevivalHeaders): void {
    if (!headers) {
      return;
    }

    headers.forEach((name, values) => {
      console.log(`${name}: ${values}`);
    });
  }
}
