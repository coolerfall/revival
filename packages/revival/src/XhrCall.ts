import { Call, CallFactory } from "./call";
import { Converter } from "./Converter";
import { ReviRequest } from "./ReviRequest";
import { ReviResponse } from "./ReviResponse";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class XhrCall<T> implements Call<T> {
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
