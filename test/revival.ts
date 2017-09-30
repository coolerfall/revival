/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */

import { default as TestApi } from "./TestApi";
import * as Sinon from "sinon";
import { SinonFakeServer } from "sinon";

class FormData {
  append(): void {}
}

declare let global: any;
global.XMLHttpRequest = Sinon.useFakeXMLHttpRequest();
global.FormData = FormData;

describe("Revival", () => {
  let server: SinonFakeServer;

  before(function() {
    server = Sinon.fakeServer.create();
    server.respondWith("POST", "http://test.com/test/post", [
      200,
      { "Content-Type": "application/json", header2: 23 },
      `{ "id": 12, "name": "Revival" }`
    ]);
  });

  after(function() {
    server.restore();
  });

  it("Get", () => {
    TestApi.testGet("testHeader", "1111", { test1: 2, test2: "yes" });
  });
  it("Post", () => {
    TestApi.testPost({ kit: 11 }).subscribe(
      s => {
        console.log(">>>>>>>>>>>>>>>>>ssssss", s);
      },
      e => console.log(">>>>@!#@#eerr", e)
    );
  });
  it("MultiPart", () => {
    TestApi.testMultiPart("This is description.");
  });
  it("FormUrlEncoded", () => {
    TestApi.testUrlFormEncode(22);
  });
  it("Headers", () => {
    TestApi.testHeaders();
  });
});
