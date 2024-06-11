# pbdq - PocketBase Deno Qwrapper
<img src="https://github.com/VentGrey/pbdq/assets/24773698/020830a0-3043-4947-9a01-a3de1166800a" height="250" width="250"/>

> Qwrapper means Query Wrapper.

## Introduction 👀

pbd (or pbdq) is a TypeScript wrapper for the
[PocketBase](https://pocketbase.io) database. As the official SDK was not meant
to be used in server side TS, I created this wrapper to make it easier to use
the PocketBase SDK in the server. This should allow you to write a middle server
that can act as a load balancer, monitor, observability node, etc over a given
PocketBase instance.

Any issues you find here, please open an issue and don't blame the PocketBase
team with issues present here (which) are not related to the SDK directly.

This wrapper is meant to be used with Deno, however, since the only dependency
is `npm:pocketbase`, and it's deployed via `JSR` you should be able to use it in
any other environment. Be aware that I created this for my own purposes and will
consider my own use cases. I'm open to patches that follow the Python zen:
_Special cases are not special enough to break the rules_.

> [!IMPORTANT]\
> If this library causes any bugs for you please report them here as an issue.
> **DO NOT OPEN** pbdq bugs or support requests in the official PocketBase
> repository.

## Features 🌟 ...sort of.

- Portable between JS environments thanks to JSR
- In sync with latest PocketBase JS-SDK verion
- Deno + Oak first
- No complex type-gymnastics!
- (WIP) Fully docummented and tested in production.
- Tested with:
  - [ ] Bun
  - [x] Deno
  - [x] Node
  - [ ] Browser
  - [ ] Cloudflare Workers

### Extensions 🧩

PBDQ comes with optional extensions, which are special methods that can be
called from the `pbd` instance. These extensions mix in features from the
official PocketBase JS-SDK with pbdq and simplify some actions or operations.

These are "extensions" because they are not part of the official SDK which is
the main target of this wrapper. And because these are limited to some use
cases, mainly server-only deno features.

## Limitations 🔒

- No easy way to test or publish test results from pipelines. This is because
  pbdq needs an already initialized pocketbase client. In other words, a
  working, reachable PocketBase instance is needed. I haven't found a way to
  either "mock" the client or how to expose a pocketbase instance for Actions to
  use.

- No support for realtime service. This is because I don't use that feature
  myself.

- Not really tested in browsers. This was made for server side + Deno in mind.
  Tho, it would make sense if this runs in the browser as well, since JSR
  produces ESModules and the JS-SDK is for Web Frameworks with SPA/MPA/SSR
  support. I wouldn't recommend overthinking bundle size though...

- Still unstable I still have to decide some parts of this:
  - [ ] Offer "extensions" which are not part of the official SDK but might give
        some extra features by combining existing library methods.
  - [ ] Whether or not to error users if they try using an admin method without
        being an admin.

- PocketBase version updates are not automatic. I still have to implement an
  automatic update mechanism.

## Installation 📦

PBDQ should be available for you in [JSR](https://jsr.io/@ventgrey/pbdq). There
you can select to download it for:

- Deno
- NPM
- Yarn
- PNPM
- Bun

## Basic Usage 🎉

> [Read The Friendly Manual](https://jsr.io/@ventgrey/pbdq/doc)

You can find examples on how to do some common operations in the `tests/`
directory.

In this example we are using TypeScript and PocketBase to get a list of products
from the `products` collection. This assumes you already have type for `Product`
in your project.

```typescript
import Client, { AdminModel, ListResult } from "pocketbase";
import PocketBase from "pocketbase";

import { Pbd } from "pbd";

import type { Product } from "./types";

const pb: Client = new PocketBase("http://localhost:8090");
const pbd: Pbd = new Pbd({ client: pb });

// To get a list of products
const products = await pbd.getList<Product>({
    collectionName: "products",
});

// If you want to change the page and the number of items returned per
// page you can use the optional parameters.
const products = await pbd.getList<Product>({
    collectionName: "products",
    page: 1,
    perPage: 10,
});

// PocketBase options are also available if you need them:
const products = await pbd.getList<Product>({
    collectionName: "products",
    options: { sort: "-created" },
});
```

### Admin Usage 🧑‍🚒

All admin operations should be available for remote PocketBase administration.

```typescript
// Admin services are also available if you need them:
const admin: AdminModel = await pbd.adminCreate({
    email: "admin@localhost",
    password: "admin",
    passwordConfirm: "admin",
    avatar: "https://avatars.githubusercontent.com/u/106275?s=200&v=4",
});
```

(At runtime) If you try to perform an admin operation but the supplied client's
AuthStore does not show administrator details, pbdq will throw a warning to the
console:

> Attempted to make an administrator operation. The current client 'isAdmin'
> state is false.

## Performance 🔋

See [BENCHMARKS.md](BENCHMARKS.md) to find how tis library might impact your
existing codebase / new environments. In every benchmark you should see both the
PBD usage and the pure pocketbase js-sdk usage.

Since the `pocketbase` npm package is written in JS and the SDK itself is js as
well. All the deno tests/benchmarks regarding pocketbase are written in JS with
JSDoc.

## Contributing 💻

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

Bear in mind that I made this project for my own purposes, if it works for you,
great. If it doesn't, you are welcome to open an issue or submit a PR.

## License 📜

**This license only applies to the bits and pieces I wrote from scratch.**

pbdq is licensed under the Gnu General Public License (GPLv3). You can find it
at
[https://www.gnu.org/licenses/agpl-3.0.en.html](https://www.gnu.org/licenses/gpl-3.0.en.html).

For more information, see [LICENSE](LICENSE)

## Original PocketBase JS-SDK license

The MIT License (MIT) Copyright (c) 2022 - present, Gani Georgiev

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
