import { Revival } from "./Revival";
import { Interceptor } from "./Interceptor";
import { CallAdapter } from "./CallAdapter";
import { Converter } from "./Converter";

/**
 * A builder to build a new {@link Revival}.
 *
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class RevivalBuilder {
  private revivalBaseUrl: string;
  private adapter: CallAdapter;
  private revialConverter: Converter;
  private interceptors: Array<Interceptor> = [];

  baseUrl(revivalBaseUrl: string): RevivalBuilder {
    this.revivalBaseUrl = revivalBaseUrl;
    return this;
  }

  callAdapter(callAdapter: CallAdapter): RevivalBuilder {
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
      this.adapter,
      this.revialConverter,
      this.interceptors
    );
  }
}
