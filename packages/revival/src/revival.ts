import { BuiltInJsonConverter } from "./BuiltInJsonConverter";
import { CallAdapter } from "./CallAdapter";
import { CallFactory } from "./call";
import { Converter } from "./Converter";
import { DefaultCallAdapter } from "./DefaultCallAdapter";
import { Interceptor } from "./Interceptor";
import { ReviRequest } from "./ReviRequest";
import { RevivalCallFactory } from "./RevivalCallFactory";
import { XhrCall } from "./XhrCall";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class Revival {
  private revivalCallFactory: CallFactory;

  constructor(
    private readonly baseUrl: string,
    private readonly callFactory: CallFactory,
    private readonly callAdapter: CallAdapter<any>,
    private readonly converter: Converter
  ) {
    if (!baseUrl) {
      throw new Error("Base url must not be null.");
    }

    if (!baseUrl.endsWith("/")) {
      throw new Error(`Base url must end with '/'.`);
    }

    this.revivalCallFactory = callFactory;
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
    let xhrCall: XhrCall<T> = new XhrCall(
      originRequest,
      this.revivalCallFactory,
      this.converter,
      isRaw
    );

    return this.callAdapter.adapt(xhrCall, isRaw);
  }
}

/**
 * A builder to build a new {@link Revival}.
 *
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RevivalBuilder {
  private revivalBaseUrl: string;
  private revivalCallFactory: CallFactory;
  private adapter: CallAdapter<any> = new DefaultCallAdapter();
  private revialConverter: Converter = new BuiltInJsonConverter();
  private interceptors: Array<Interceptor> = [];

  baseUrl(revivalBaseUrl: string): RevivalBuilder {
    this.revivalBaseUrl = revivalBaseUrl;
    return this;
  }

  callFactory(callFactory: CallFactory): RevivalBuilder {
    this.revivalCallFactory = callFactory;
    return this;
  }

  callAdapter(callAdapter: CallAdapter<any>): RevivalBuilder {
    this.adapter = callAdapter;
    return this;
  }

  converter(converter: Converter): RevivalBuilder {
    this.revialConverter = converter;
    return this;
  }

  addInterceptor(interceptor: Interceptor): RevivalBuilder {
    this.interceptors.push(interceptor);
    return this;
  }

  build(): Revival {
    if (!this.revivalCallFactory) {
      this.revivalCallFactory = new RevivalCallFactory(this.interceptors);
    }

    return new Revival(
      this.revivalBaseUrl,
      this.revivalCallFactory,
      this.adapter,
      this.revialConverter
    );
  }
}
