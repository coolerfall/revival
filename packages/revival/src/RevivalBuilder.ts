import { BuiltInJsonConverter } from "./BuiltInJsonConverter";
import { CallAdapter } from "./CallAdapter";
import { Client } from "./Client";
import { Converter } from "./Converter";
import { DefaultCallAdapter } from "./DefaultCallAdapter";
import { Interceptor } from "./Interceptor";
import { Revival } from "./Revival";
import { XHRClient } from "./XHRClient";

/**
 * A builder to build a new {@link Revival}.
 *
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RevivalBuilder {
  private revivalBaseUrl: string;
  private revivalClient: Client = new XHRClient();
  private adapter: CallAdapter<any> = new DefaultCallAdapter();
  private revialConverter: Converter = new BuiltInJsonConverter();
  private interceptors: Array<Interceptor> = [];

  baseUrl(revivalBaseUrl: string): RevivalBuilder {
    this.revivalBaseUrl = revivalBaseUrl;
    return this;
  }

  client(client: Client): RevivalBuilder {
    this.revivalClient = client;
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
    return new Revival(
      this.revivalBaseUrl,
      this.revivalClient,
      this.adapter,
      this.revialConverter,
      this.interceptors
    );
  }
}
