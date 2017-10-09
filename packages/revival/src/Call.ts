import { ReviResponse } from "./ReviResponse";
import { ReviRequest } from "./ReviRequest";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export interface Call<T> {
  request(): ReviRequest;
  execute(): ReviResponse;
  enqueue(
    onResponse?: (response: ReviResponse) => void,
    onFailure?: () => void
  ): void;
}
