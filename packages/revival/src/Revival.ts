import { CallAdapter } from "./CallAdapter";
import { Client } from "./Client";
import { Converter } from "./Converter";
import { Interceptor } from "./Interceptor";
import { ReviRequest } from "./ReviRequest";
import { XHRCall } from "./XHRCall";
import { RevivalCallFactory } from "./RevivalCallFactory";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class Revival {
  private revivalCallFactory: RevivalCallFactory;

  constructor(
    private readonly baseUrl: string,
    private readonly client: Client,
    private readonly callAdapter: CallAdapter<any>,
    private readonly converter: Converter,
    interceptors?: Array<Interceptor>
  ) {
    if (!baseUrl) {
      throw new Error("Base url must not be null.");
    }

    if (!baseUrl.endsWith("/")) {
      throw new Error(`Base url must end with '/'.`);
    }

    this.revivalCallFactory = new RevivalCallFactory(client, interceptors);
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

  call<T>(originRequest: ReviRequest, isRaw: boolean): any {
    let xhrCall: XHRCall<T> = new XHRCall(
      originRequest,
      this.revivalCallFactory,
      this.converter,
      isRaw
    );

    return this.callAdapter.adapt(xhrCall, isRaw);
  }
}
