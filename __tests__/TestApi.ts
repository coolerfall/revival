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
  POST,
  Query,
  QueryMap,
  Raw
} from "../src/http/decorators";
import { Observable } from "rxjs/Observable";
import { DUMMY } from "../src/dummy";
import { Revival } from "../src/Revival";
import { LogInterceptor } from "./LogInterceptor";
import { RevivalBuilder } from "../src/RevivalBuilder";
import { RxjsCallAdapter } from "../src/adapter/RxjsCallAdapter";
import { JsonConverter } from "../src/JsonConverter";

let revival: Revival = new RevivalBuilder()
  .baseUrl("http://test.com/")
  .callAdapter(new RxjsCallAdapter())
  .converter(new JsonConverter())
  .addInterceptor(new LogInterceptor())
  .build();

export class TestApi {
  @Raw
  @GET("test/get")
  testGet(
    @Header("head1") header: string,
    @Query("string") query: string,
    @QueryMap map: object
  ): Observable<Response> {
    return DUMMY;
  }

  @POST("test/post")
  testPost(@Body body: object): Observable<any> {
    return DUMMY;
  }

  @MultiPart
  @POST("test/multipart")
  testMultiPart(@Part("desc") description: string): Observable<any> {
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
