import { Interceptor } from "./Interceptor";
import { CallServerInterceptor } from "./CallServerInterceptor";
import { ReviRequest } from "./ReviRequest";
import { XHRClient } from "./XHRClient";
import { CallAdapter } from "./CallAdapter";
import { XHRCall } from "./XHRCall";
import { Converter } from "./Converter";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class Revival {
  private baseUrl: string;
  private interceptors: Array<Interceptor> = [];

  constructor(
    baseUrl: string,
    private readonly callAdapter: CallAdapter,
    private readonly converter: Converter,
    interceptors?: Array<Interceptor>
  ) {
    if (!baseUrl) {
      throw new Error("Base url must not be null.");
    }

    if (!baseUrl.endsWith("/")) {
      throw new Error(`Base url must end with '/'.`);
    }

    this.baseUrl = baseUrl;
    if (interceptors) {
      this.interceptors.push(...interceptors);
    }
  }

  create<T>(apiClazz: { new (): T }): T {
    let api: T = new apiClazz();
    let target: any = Object.getPrototypeOf(api);
    target["Api_Revival"] = this;
    return api;
  }

  fullUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  call(originRequest: ReviRequest, isRaw: boolean): any {
    let interceptors: Array<Interceptor> = [];
    interceptors.push(...this.interceptors);
    interceptors.push(new CallServerInterceptor());

    let xhrClient: XHRClient = new XHRClient(interceptors);
    let xhrCall: XHRCall = new XHRCall(
      originRequest,
      xhrClient,
      this.converter,
      isRaw
    );

    return this.callAdapter.adapt(xhrCall);
  }
}
