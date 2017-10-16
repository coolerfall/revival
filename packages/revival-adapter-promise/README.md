Promise Adapter
======
An adapter for adapting promise types.

Installation and Usage
====
```sh
npm install revival-adapter-promise
```
or
```sh
yarn add revival-adapter-promise
```

* And use them as below:
```typescript
let revival: Revival = new RevivalBuilder()
  .baseUrl("http://test.com/")
  .addCallAdapter(PromiseCallAdapter.create())
  .build();
```

* Now your api can use as `Promise`:
```typescript
class MyApi {
  @GET("user/{id}") loadAccount(@Path id: string) : Promise<Account> {
    return DUMMY;
  }
}
```


Credits
=======
* [Retrofit][1] - Type-safe HTTP client for Android and Java by Square, Inc.


License
======
```text
	MIT License

	Copyright (C) 2017-present Vincent Cheung

	This source code is licensed under the MIT license found in the
	LICENSE file in the root directory of this source tree.
```

[1]: https://github.com/square/retrofit