/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CallAdapter, DefaultCallAdapter } from "./call-adapter";
import { Call, CallFactory, DefaultCallFactory } from "./call";
import {
  BuiltInConverterFactory,
  Converter,
  ConverterFactory
} from "./converter";
import { Interceptor } from "./interceptor";
import { ReviRequest } from "./request";
import { ReviResponse } from "./response";
import { checkNotNull } from "./utils";

/**
 * Revival will turns all decorators in api class to http request.
 */
export class Revival {
  constructor(
    private readonly baseUrl: string,
    private readonly callFactory: CallFactory,
    private readonly callAdapters: Array<CallAdapter<any>>,
    private readonly converterFactory: ConverterFactory
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

  private callAdapter(returnType: any): CallAdapter<any> {
    for (let i = 0; i < this.callAdapters.length; i++) {
      let adapter: CallAdapter<any> = this.callAdapters[i];
      if (adapter.check(returnType)) {
        return adapter;
      }
    }

    throw new Error(
      `No call adapter found for given return type ${returnType}`
    );
  }

  /**
   * Return an available serialize converter to serialize request body.
   *
   * @returns serialize converter
   */
  serializer(): Converter<any, any> {
    return this.converterFactory.serializer();
  }

  /**
   * Make a new revival call.
   *
   * @param originRequest origin request
   * @param returnType return type
   * @param isRaw return raw callback or not
   * @returns adapted result
   */
  call<T>(originRequest: ReviRequest, returnType: any, isRaw: boolean): any {
    let revivalCall: RevivalCall<T> = new RevivalCall(
      originRequest,
      this.callFactory,
      this.converterFactory
    );

    return this.callAdapter(returnType).adapt(revivalCall, isRaw);
  }
}

class RevivalCall<T> implements Call<T> {
  private call: Call<any>;

  constructor(
    private readonly originRequest: ReviRequest,
    private readonly callFactory: CallFactory,
    private readonly converterFactory: ConverterFactory
  ) {}

  request(): ReviRequest {
    return this.originRequest;
  }

  enqueue(
    onResponse?: (response: ReviResponse) => void,
    onFailure?: (error: any) => void
  ): void {
    this.call = this.callFactory.newCall(this.originRequest);
    this.call.enqueue(
      response => onResponse && onResponse(this.parseResponse(response)),
      onFailure
    );
  }

  cancel(): void {
    if (!this.call) {
      return;
    }

    this.call.cancel();
  }

  private parseResponse(response: ReviResponse): ReviResponse {
    if (response.code === 204 || response.code === 205 || !response.body) {
      return response;
    }

    return Object.assign(response, {
      body: this.converterFactory.deserializer().convert(response.body)
    });
  }
}

/**
 * A builder to build a new {@link Revival}.
 */
export class RevivalBuilder {
  private $baseUrl: string;
  private $callFactory: CallFactory;
  private callAdapters: Array<CallAdapter<any>> = [];
  private $converterFactory: ConverterFactory = new BuiltInConverterFactory();
  private readonly interceptors: Array<Interceptor> = [];

  baseUrl(baseUrl: string): RevivalBuilder {
    this.$baseUrl = checkNotNull(baseUrl, "baseUrl is null or undefined");
    return this;
  }

  callFactory(callFactory: CallFactory): RevivalBuilder {
    this.$callFactory = checkNotNull(
      callFactory,
      "callFactory is null or undefined"
    );
    return this;
  }

  addCallAdapter(callAdapter: CallAdapter<any>): RevivalBuilder {
    this.callAdapters.push(
      checkNotNull(callAdapter, "callAdapter is null or undefined")
    );
    return this;
  }

  converterFactory(converterFactory: ConverterFactory): RevivalBuilder {
    this.$converterFactory = checkNotNull(
      converterFactory,
      "converterFactory is null or undefined"
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
    if (!this.$callFactory) {
      this.$callFactory = new DefaultCallFactory(this.interceptors);
    }
    this.callAdapters.push(new DefaultCallAdapter());

    return new Revival(
      this.$baseUrl,
      this.$callFactory,
      this.callAdapters,
      this.$converterFactory
    );
  }
}
