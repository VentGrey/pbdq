# pbdq - PocketBase Deno Qwrapper 🦕📚

> Qwrapper means Query Wrapper (?)

## Introduction 👀

Ppd (or pbdq) is a TypeScript wrapper for the [PocketBase](https://pocketbase.io) database. As the official SDK was not
meant to be used in server side TS, I created this wrapper to make it easier to use the PocketBase SDK in the server.
This should allow you to write a middle server that can act as a load balancer, monitor, observability node, etc over
a given PocketBase instance.

Any issues you find here, please open an issue and don't blame the PocketBase team with issues present here (which)
are not related to the SDK directly.

This wrapper is meant to be used with Deno, however, since the only dependency is `npm:pocketbase`, and it's deployed
via `JSR` you should be able to use it in any other environment. Be aware that I created this for my own purposes and
will consider my own use cases. I'm open to patches that follow the Python zen: _Special cases are not special enough to break the rules_.

## Features 🌟

- Portable between JS environments thanks to JSR
- In sync with latest PocketBase JS-SDK verion
- Deno first
- No complex type-gymnastics.
- (WIP) Fully docummented and tested in production.

## Installation 📦

WIP - Still polishing some things until it works just enough to be published in JSR.

## Basic Usage 🎉

In this example we are using TypeScript and PocketBase to get a list of products
from the `products` collection. This assumes you already have type for
`Product` in your project.

```typescript
import Client, { ListResult } from "pocketbase";
import PocketBase from "pocketbase";

import { Pbd } from "pbd";

import type { Product } from "./types";

const pb: Client = new PocketBase("http://localhost:8090");
const pbd: Pbd = new Pbd({ client: pb });

// To get a list of products
const products = await pbd.getList<Product>({
    collectionName: "products"
});

// If you want to change the page and the number of items returned per
// page you can use the optional parameters.  
const products = await pbd.getList<Product>({
        collectionName: "products",
        page: 1,
        perPage: 10
});
   
// PocketBase options are also available if you need them:
const products = await pbd.getList<Product>({
    collectionName: "products",
    options: { sort: "-created" }
});
```

## Contributing 💻

See the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

Bear in mind that I made this project for my own purposes, if it works for you,
great. If it doesn't, you are welcome to open an issue or submit a PR.

## License 📜

**This license only applies to the bits and pieces I wrote from scratch.**

pbdq is licensed under the Gnu General Public License (GPLv3). You can find it at
[https://www.gnu.org/licenses/agpl-3.0.en.html](https://www.gnu.org/licenses/gpl-3.0.en.html).

For more information, see [LICENSE](LICENSE)

## Original PocketBase JS-SDK license

The MIT License (MIT)
Copyright (c) 2022 - present, Gani Georgiev

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.