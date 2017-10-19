/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */

import { Converter, ConverterFactory } from "revival";
import { json2xml, xml2json } from "xml-js";

export class SimpleXmlConverterFactory implements ConverterFactory {
  serializer(): Converter<any, string> {
    return new SimpleXmlSerializer();
  }

  deserializer(): Converter<string, any> {
    return new SimpleXmlDeserializer();
  }
}

class SimpleXmlSerializer implements Converter<any, string> {
  convert(value: any): string {
    return json2xml(JSON.stringify(value), { compact: true });
  }
}

class SimpleXmlDeserializer implements Converter<string, any> {
  convert(value: string): any {
    return xml2json(value);
  }
}
