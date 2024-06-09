# Benchmarks 🔋

This file contains some benchmarks using this library. You should not see these
benchmarks as a speed comparison. Instead, see the benchmarks as part of the
added overhead of this library.

Take this things into consideration when running/interpreting these benchmarks
yourself:

- [Deno bench warms up](https://github.com/denoland/deno/issues/17649#issuecomment-1416761766)
- Node/Bun tests might take some time to be recorded here.
- All tests used the exact same database container in `localhost`.

The numbers here may vary from computer to computer, from network to network.
Don't take these numers for granted.

## Authentication (username/email and password)

### Pocketbase - Deno

```
cpu: Intel(R) Core(TM) i7-7600U CPU @ 2.80GHz
runtime: deno 1.44.1 (x86_64-unknown-linux-gnu)

benchmark                         time (avg)        iter/s             (min … max)       p75       p99      p995
---------------------------------------------------------------------------------- -----------------------------
Test authentication (JS-SDK)     247.76 ms/iter           4.0 (231.14 ms … 259.59 ms) 254.5 ms 259.59 ms 259.59 ms
```

### PBD - Deno

```
cpu: Intel(R) Core(TM) i7-7600U CPU @ 2.80GHz
runtime: deno 1.44.1 (x86_64-unknown-linux-gnu)

benchmark                time (avg)        iter/s             (min … max)       p75       p99      p995
------------------------------------------------------------------------- -----------------------------
Test authentication     244.99 ms/iter           4.1 (232.33 ms … 253.33 ms) 251.2 ms 253.33 ms 253.33 ms
```
