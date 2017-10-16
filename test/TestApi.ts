/**
 * @author Vincent Cheung (coolingfall@gmail.com)
 */
import {
  Body,
  Field,
  FormUrlEncoded,
  GET,
  Header,
  Headers,
  MultiPart,
  Part,
  Path,
  POST,
  Query,
  QueryMap,
  Raw
} from "../packages/revival/src/http/decorators";
import { Observable } from "rxjs/Observable";
import { DUMMY } from "../packages/revival/src/dummy";
import { Revival, RevivalBuilder } from "../packages/revival/src/revival";
import { LogInterceptor } from "./LogInterceptor";
import { RxjsCallAdapter } from "../packages/revival-adapter-rxjs/src/rxjs-call-adapter";
import { PromiseCallAdapter } from "../packages/revival-adapter-promise/src/promise-call-adapter";
import { Call } from "../packages/revival/src/call";

let revival: Revival = new RevivalBuilder()
  .baseUrl("http://test.com/")
  .addCallAdapter(RxjsCallAdapter.create() as any)
  .addCallAdapter(PromiseCallAdapter.create() as any)
  .addInterceptor(new LogInterceptor() as any)
  .build();

class TestApi {
  @Raw
  @GET("test/get/{user}/{id}")
  testGet(
    @Header("head1") header: string,
    @Query("string") query: string,
    @Path("user") user: string,
    @Path("id") id: string,
    @QueryMap map: object
  ): Call<Response> {
    return DUMMY;
  }

  @POST("test/post")
  testPost(@Body body: object): Observable<any> {
    return DUMMY;
  }

  @MultiPart
  @POST("test/multipart")
  testMultiPart(@Part("desc") description: string): Promise<any> {
    return DUMMY;
  }

  @FormUrlEncoded
  @POST("test/urlFormEncode")
  testUrlFormEncode(@Field("number") field: number): Observable<any> {
    return DUMMY;
  }

  @Headers({ header1: 8, header2: "This" })
  @GET("test/headers")
  testHeaders(): Observable<any> {
    return DUMMY;
  }
}

export default revival.create(TestApi);
