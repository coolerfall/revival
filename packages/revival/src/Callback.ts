import { ReviResponse } from "./ReviResponse";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface Callback {
  onResponse(response: ReviResponse): void;
  onFailure(): void;
}
