import { Method } from "./Method";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface ReviRequest {
  url: string;
  method: Method;
  headers?: object;
  params?: any;
}
