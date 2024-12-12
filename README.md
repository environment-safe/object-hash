object-hash
===========
A Cleanroom ESM reimplementation of [object-hash](https://www.npmjs.com/package/object-hash) without streams, but source compatible in the browser or server.

* Hash values of any type.
* Supports a keys only option for grouping similar objects with different values.

Usage
-----

```js
var hash = require('object-hash');

hash({foo: 'bar'}) // => '67b69634f9880a282c14a0f0cb7ba20cf5d677e9'
hash([1, 2, 2.718, 3.14159]) // => '136b9b88375971dff9f1af09d7356e3e04281951'
```

## hash(value, options)

Generate a hash from any object or type.  Defaults to sha1 with hex encoding.

* `algorithm` hash algo to be used: 'sha1', 'md5', 'passthrough'. default: sha1
  * This supports the algorithms returned by `crypto.getHashes()`. Note that the default of SHA-1 is not considered secure, and a stronger algorithm should be used if a cryptographical hash is desired.
  * This also supports the `passthrough` algorith, which will return the information that would otherwise have been hashed.
* `excludeValues` {true|false} hash object keys, values ignored. default: false
* `encoding` hash encoding, supports 'buffer', 'hex', 'binary', 'base64'. default: hex
* `ignoreUnknown` {true|*false} ignore unknown object types. default: false
* `replacer` optional function that replaces values before hashing. default: accept all values
* `respectFunctionProperties` {true|false} Whether properties on functions are considered when hashing. default: true
* `respectFunctionNames` {true|false} consider `name` property of functions for hashing. default: true
* `respectType` {true|false} Whether special type attributes (`.prototype`, `.__proto__`, `.constructor`)
   are hashed. default: true
* `unorderedArrays` {true|false} Sort all arrays before hashing. Note that this affects *all* collections,
   i.e. including typed arrays, Sets, Maps, etc. default: false
* `unorderedSets` {true|false} Sort `Set` and `Map` instances before hashing, i.e. make
  `hash(new Set([1, 2])) == hash(new Set([2, 1]))` return `true`. default: true
* `unorderedObjects` {true|false} Sort objects before hashing, i.e. make `hash({ x: 1, y: 2 }) === hash({ y: 2, x: 1 })`. default: true
* `excludeKeys` optional function for excluding specific key(s) from hashing, if true is returned then exclude from hash. default: include all keys

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless in chrome:
```bash
npm run headless-browser-test
```

to run the same test inside docker:
```bash
npm run container-test
```

Run the commonjs tests against the `/dist` commonjs source (generated with the `build-commonjs` target).
```bash
npm run require-test
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

