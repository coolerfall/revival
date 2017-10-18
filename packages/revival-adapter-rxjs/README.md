Rxjs Adapter
======
An adapter for adapting [rxjs][1] types.

Installation and Usage
====
```sh
npm install revival-adapter-rxjs
```
or
```sh
yarn add revival-adapter-rxjs
```

* And use them as below:
```typescript
let revival: Revival = new RevivalBuilder()
  .baseUrl("http://test.com/")
  .addCallAdapter(RxjsCallAdapter.create())
  .build();
```

* Now your api can use as `Observable`:
```typescript
class MyApi {
  @GET("user/{id}") loadAccount(@Path id: string) : Observable<Account> {
    return DUMMY;
  }
}
```


Credits
=======
* [Retrofit][2] - Type-safe HTTP client for Android and Java by Square, Inc.


License
======
```text
	MIT License

	Copyright (C) 2017-present Vincent Cheung

	This source code is licensed under the MIT license found in the
	LICENSE file in the root directory of this source tree.
```

[1]: https://github.com/ReactiveX/rxjs
[2]: https://github.com/square/retrofit