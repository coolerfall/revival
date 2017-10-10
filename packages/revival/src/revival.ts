/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CallAdapter, DefaultCallAdapter } from "./call-adapter";
import { Call, CallFactory, DefaultCallFactory } from "./call";
import { BuiltInJsonConverter, Converter } from "./Converter";
import { Interceptor } from "./interceptor";
import { ReviRequest } from "./request";
import { ReviResponse } from "./response";
import { checkNotNull } from "./utils";

export class Revival {
  constructor(
    private readonly baseUrl: string,
    private readonly callFactory: CallFactory,
    private readonly callAdapter: CallAdapter<any>,
    private readonly converter: Converter
  ) {
    if (!baseUrl.endsWith("/")) {
      throw new Error(`Base url must end with '/'.`);
    }
  }

  /**
   * Create a new api instance with given api class.
   *
   * @param apiClazz api class
   * @returns api instance
   */
  create<T>(apiClazz: { new (): T }): T {
    let api: T = new apiClazz();
    let target: any = Object.getPrototypeOf(api);
    target["Api_Revival"] = this;
    return api;
  }

  /**
   * Get full url with given path.
   *
   * @param {string} path path
   * @returns {string} full url
   */
  fullUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  call<T>(originRequest: ReviRequest, isRaw: boolean): any {
    let realCall: RevivalCall<T> = new RevivalCall(
      originRequest,
      this.callFactory,
      this.converter,
      isRaw
    );

    return this.callAdapter.adapt(realCall, isRaw);
  }
}

class RevivalCall<T> implements Call<T> {
  constructor(
    private readonly originRequest: ReviRequest,
    private readonly factory: CallFactory,
    private readonly converter: Converter,
    private readonly isRaw: boolean
  ) {}

  request(): ReviRequest {
    return this.originRequest;
  }

  execute(): ReviResponse {
    let response: ReviResponse = this.factory
      .newCall(this.originRequest)
      .execute();
    return this.isRaw ? response : this.converter.convert(response);
  }

  enqueue(
    onResponse?: (response: ReviResponse) => void,
    onFailure?: () => void
  ): void {
    this.factory
      .newCall(this.originRequest)
      .enqueue(
        response =>
          onResponse &&
          onResponse(
            this.isRaw ? response : this.converter.convert(response).body
          ),
        onFailure
      );
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
  private revivalConverter: Converter = new BuiltInJsonConverter();
  private readonly interceptors: Array<Interceptor> = [];

  baseUrl(baseUrl: string): RevivalBuilder {
    this.revivalBaseUrl = checkNotNull(baseUrl, "baseUrl is null or undefined");
    return this;
  }

  callFactory(callFactory: CallFactory): RevivalBuilder {
    this.revivalCallFactory = checkNotNull(
      callFactory,
      "callFactory is null or undefined"
    );
    return this;
  }

  callAdapter(callAdapter: CallAdapter<any>): RevivalBuilder {
    this.adapter = checkNotNull(
      callAdapter,
      "callAdapter is null or undefined"
    );
    return this;
  }

  converter(converter: Converter): RevivalBuilder {
    this.revivalConverter = checkNotNull(
      converter,
      "converter is null or undefined"
    );
    return this;
  }

  addInterceptor(interceptor: Interceptor): RevivalBuilder {
    this.interceptors.push(
      checkNotNull(interceptor, "interceptor is null or undefined")
    );
    return this;
  }

  build(): Revival {
    if (!this.revivalCallFactory) {
      this.revivalCallFactory = new DefaultCallFactory(this.interceptors);
    }

    return new Revival(
      this.revivalBaseUrl,
      this.revivalCallFactory,
      this.adapter,
      this.revivalConverter
    );
  }
}
