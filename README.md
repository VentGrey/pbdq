# pbdq - PocketBase Deno Qwrapper

<img src="https://github.com/VentGrey/pbdq/assets/24773698/020830a0-3043-4947-9a01-a3de1166800a" height="250" width="250"/>

> Qwrapper means Query Wrapper.

## Introduction 👀

pbd (or pbdq) is a TypeScript wrapper for the
[PocketBase](https://pocketbase.io) database. I created this wrapper to make the
PocketBase SDK easier to use in Deno. This should allow you to write a middle
server that can act as a load balancer, monitor, observability node, change the
known API endpoint routes and more, while giving you the ability to redirect
your Oak requests to the PocketBase API.

Any issues you find here, please open an issue and don't blame the PocketBase
team with issues present here (which) are not related to the SDK directly.

This wrapper is meant to be used with Deno, however, since the only dependency
is `npm:pocketbase`, and it's deployed via `JSR` you should be able to use it in
any other environment. Be aware that I created this for my own purposes and will
consider my own use cases. I'm open to patches that follow the Python zen:
_Special cases are not special enough to break the rules_.

> [!IMPORTANT] If this library causes any bugs for you please report them here
> as an issue. **DO NOT OPEN** pbdq bugs or support requests in the official
> PocketBase repository.

## Features 🌟 and limitations

- Portable between JS environments thanks to JSR
- In sync with latest PocketBase JS-SDK verion
- Deno + Oak first
- No complex type-gymnastics!
- (WIP) Fully docummented and tested in production.
- Tested with:
  - [x] Bun
  - [x] Deno
  - [x] Node
  - [ ] Browser
  - [ ] Cloudflare Workers

- ❌ No realtime collection support
- ❌ Slower than pure sdk in browsers
- ❌ Tests are performed locally. You'll have to setup a local PocketBase
  instance for this to work. You can use the provided assets in the
  `pocketbase/` directory in this project.

### Extension Functions 🧩

PBDQ comes with optional extensions, which are special methods that can be
called from the `pbd` instance. These extensions mix in features from the
official PocketBase JS-SDK with pbdq and simplify some actions or operations.

These are "extensions" because they are not part of the official SDK which is
the main target of this wrapper. And because these are limited to some use
cases, mainly server-only deno features.

#### Deno Cron Extension 🕒

> [!IMPORTANT] Pocketbase already has an "Automatic" backups feature with
> automatic cleaning in their User Interface.
>
> This extension is for cases where you want to create your backups outside the
> user interface. For example a second backup server with custom schedules or
> archival purposes.

This extension allows you to setup a cron job to backup the PocketBase. It sets
up a Deno Cron Job to create a backup of the database:

```typescript
import { Client }, PocketBase from "pocketbase";
import { Pbd } from "@ventgrey/pbdq";
import { PbdExt } from "@ventgrey/pbdq";

const pb: Client = new PocketBase("http://127.0.0.1:8090");
const pbd: Pbd = new Pbd({ client: pb });


PbdExt.cron.setupBackup(pbd, {
    cronExpression: "0 0 * * *", // every day at 00:00
    backupName: "my-backup", // the .zip will be added automatically
});
```

This will create a backup every day at 00:00. You can register multiple cron
jobs if you want. All cronjobs registered with this extension will be named:
`PocketBase Backup (Random-UUID)`.

If you don't choose a backup name, the default will be a backup made with the
current date and time: `auto-YYYY-MM-DD-HH-MM-SS.zip`, for example
`auto-2022-01-01-00-00-00.zip`.

#### Get Pocketbase emitted JWT Header

```typescript
import { Client }, PocketBase from "pocketbase";
import { Pbd } from "@ventgrey/pbdq";
import { PbdExt } from "@ventgrey/pbdq";

const pb: Client = new PocketBase("http://127.0.0.1:8090");
const pbd: Pbd = new Pbd({ client: pb });

// If the current AuthStore is invalid, this will return an empty string.
const token: string = PbdExt.auth.getJwtHeader(pbd);

console.log(token);
```

If this is successful, the console statement will print the base64 encoded JWT
header.

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
import Client from "pocketbase";
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

You can also instantiate the Pocketbase client inside the Pbd instance. This is
useful if you don't want to create a new client for every operation and export
the Pbd instance as a singleton:

```typescript
import PocketBase from "pocketbase";
import { Pbd } from "pbd";

const pbd: Pbd = new Pbd({
    client: new PocketBase("http://localhost:8090"),
}).

await pbd.authWithPassowrd({
  username_or_email: "denouser@domain.com",
  password: "denopassword",
});

// If authentication is successful, the client is now authenticated.

console.log(pbd.client.authStore.isValid); // true

// Export the Pbd instance to use it in other parts of your project.

export default pbd;
```

In other files you can also access the `pbd` instance directly:

```typescript
import Client, { AdminModel, ListResult } from "pocketbase";
import PocketBase from "pocketbase";

// Assuming you already have a Pbd instance in a pbd.ts file
import pbd from "./pbd.ts";

// Assuming you have a Cat type
import type { Cat } from "./types";

const olderCats: Cat[] = await pbd.getList<Cat>({
    sort: "-created",
    filter: "age < 5",
});

console.log(olderCats);
```

### Special settings 📝

Pbdq comes with some some special settings that can be used in your project.

- `unauthorized_errors` (`boolean`): Whether or not to throw an error if the
  user is not logged in before any operation that requires authentication by
  default (either user or admin). Defaults to `false`.

- `return_null_on_error` (`boolean`): Whether or not to return a `null` result
  if an error occurs. Defaults to `false`. This will return `null` instead of
  throwing a PocketBase error. Defaults to `false`.

For example:

```typescript
import Client, { AdminModel, ListResult } from "pocketbase";
import { Pbd } from "@ventgrey/pbdq";

const pb: Client = new PocketBase("http://localhost:8090");

const pbd: Pbd = new Pbd({
    client: pb,
    unauthorized_errors: true,
});

// Skip authentication
await pbd.listBackups();
```

will throw an error since `listBackups` requires admin authentication.

> Attempted to make an administrator operation. The current client 'isAdmin'
> state is false.

For `return_null_on_error` you can also set it to `true`:

```typescript
import Client, { AdminModel, ListResult } from "pocketbase";
import { Pbd } from "@ventgrey/pbdq";

// Assuming you already have a zod schema.
import { Cat, catSchema } from "./schemas/cat.ts";

const pb: Client = new PocketBase("http://localhost:8090");
const pbd: Pbd = new Pbd({
    client: pb,
    return_null_on_error: true,
});

// Get a list of all cats
const cats: Cat[] | null = await pbd.getList<Cat>({
    collectionName: "cats",
});

if (!cats || !Array.isArray(cats)) throw new Error("Failed to get cats");
```

## Performance 🔋

> [!IMPORTANT] Do not take these benchmarks as a real indicator of the
> performance of your project. If, in some updates the speed of PBD "looks" like
> it's faster than the JS-SDK, it might be more of a coincidence than a real
> performance gain.

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
