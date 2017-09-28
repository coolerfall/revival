import { ReviResponse } from "./ReviResponse";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface Converter {
  convert(value: ReviResponse): ReviResponse;
}
