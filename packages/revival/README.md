Revival
======
A RESTful http client for react native and typescript based on XMLHttpRequest.

Installation and Usage
====

* Revival only support typescript cause it uses decoratos:

```sh
npm install revival
```
or
```sh
yarn add revival
```

* Add `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` in `tsconfig.json`.

* Create api in your project as below:

```typescript
import { DUMMY, GET, Path } from "revival"

class MyApi {
  @GET("user/{id}")
  loadAccount(@Path("id") id: string) : Call<Account> {
    return DUMMY;
  }
}
```

* `Revival` will turns all decorators to http request:
```typescript
let revival: Revival = new RevivalBuilder()
  .baseUrl("http://test.com/")
  .addInterceptor(new LogInterceptor())
  .build();

let myapi = revival.create(MyApi);
```

* Then you can call the api in asynchronous mode(with enqueue):
```typescript
let Call<Account> = myapi.loadAccount("Vincent");
```

* Revival supports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`.
* Request url can be set dynamically with `@Path`, and the path must surrounded by { and }:
```typescript
  @GET("user/{id}")
  loadAccount(@Path("id") id: string) : Call<Account> {
    return DUMMY;
  }
```

Query parameter can be added with `@Query`:
```typescript
@GET("user/{id}")
  loadAccount(@Path("id") id: string, @Query("type") type: string) : Call<Account> {
    return DUMMY;
  }
```

For complex query parameters, you can use a object with `@QueryMap`:
```typescript
@GET("user/{id}")
loadAccount(@Path("id") id: string, @QueryMap user: User) : Call<Account> {
    return DUMMY;
  }
```

* An object can be used as a http request body with `@Body`:
```typescript
@POST("user/new")
createUser(@Body user: User) : Call<Account> {
  return DUMMY;
}
```

* Methods can also be declared to send form-encoded(wtth `@FormUrlEncoded`) and multipart(with `@Multipart`) data:
```typescript
@FormUrlEncoded
@POST("user/update")
updateAccount(@Field("age") age: number, @Field("email") email: string) {
  return DUMMY;
}

@Multipart
@PUT("user/update")
updateAccount(@Part("avatar") avatar: Avatar, @Part("name") name: string) {
  return DUMMY;
}
```

* Revival will use json to serialize and  parse body by default, if you want to convert to something else like xml, you can implement a `ConverterFactory` to serialize and parse body. Use them as below:
```typescript
let revival: Revival = new RevivalBuilder()
  .baseUrl("http://test.com/")
  .converterFactory(new XmlConvertFactory())
  .build();
```

If you just want a `ReviResponse`, you must add `@Raw`:
```typescript
@Raw
@POST("user/password")
createPassword(@Body password: Password) : Call<ReviResponse> {
  return DUMMY;
}
```

* Revival supports call adapter which will turn `Call` to rxjs, promise. Check [adapter-rxjs](../revival-adapter-rxjs/)  and [adapter-promise](../revival-adapter-promise/)


Credits
=======
* [Retrofit][1] - Type-safe HTTP client for Android and Java by Square, Inc.
* [Angular/http][2] - One framework. Mobile & desktop. 


License
======
```text
	MIT License

	Copyright (C) 2017-present Vincent Cheung

	This source code is licensed under the MIT license found in the
	LICENSE file in the root directory of this source tree.
```

[1]: https://github.com/square/retrofit
[2]: https://github.com/angular/angular