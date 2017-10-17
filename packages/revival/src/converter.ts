/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Convert objects to and from their representation in http request.
 */
export interface Converter<F, T> {
  convert(value: F): T;
}

/**
 * A converter factory to create serialize and parse {@link Converter}.
 */
export interface ConverterFactory {
  /**
   * Create a serializer to serialize request body.
   *
   * @returns serialize converter
   */
  serializer(): Converter<any, string>;

  /**
   * Create a deserializer to serialize response body.
   *
   * @returns parse converter
   */
  deserializer(): Converter<string, any>;
}

/**
 * Built in json converter factory used in {@link Revival}.
 */
export class BuiltInConverterFactory implements ConverterFactory {
  serializer(): Converter<any, string> {
    return new BuiltInJsonSerializer();
  }

  deserializer(): Converter<string, any> {
    return new BuiltInJsonParser();
  }
}

/**
 * Built in json serializer used in {@link BuiltInConverterFactory}.
 */
class BuiltInJsonSerializer implements Converter<any, string> {
  convert(value: any): string {
    return JSON.stringify(value);
  }
}

/**
 * Built in json deserializer used in {@link BuiltInConverterFactory}.
 */
class BuiltInJsonParser implements Converter<string, any> {
  convert(value: string): any {
    return JSON.parse(value);
  }
}
