import { Call } from "./Call";
import { ReviRequest } from "./ReviRequest";
import { ReviResponse } from "./ReviResponse";
import { Callback } from "./Callback";
import { CallFactory } from "./CallFactory";
import { Converter } from "./Converter";

/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
export class XHRCall implements Call {
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

  enqueue(callback: Callback): void {
    throw new Error("Method not implemented.");
  }
}
