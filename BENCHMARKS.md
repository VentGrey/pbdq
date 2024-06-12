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
Don't take these numers for granted. No guarantees are given.

## Deno 🦕

These benchmarks are run with `deno bench` are are present in the `tests/`
directory. You may interpret them in the following way:

- benchmark: The name of the benchmark function.
- time (avg): The average time of the benchmark.
- iter/s: The number of iterations per second.
- (min…max): The minimum and maximum time of the benchmark.
- p75, p99, p995: The 75th, 99th, and 99.5th percentile of the benchmark.
  - p75: The 75th percentile of the benchmark. This means that the 75% of the
    execution times are less or equal to this value.
  - p99: The 99th percentile of the benchmark. This means that the 99% of the
    execution times are less or equal to this value.
  - p995: The 99.5th percentile of the benchmark. This means that the 99.5% of

### Pocketbase JS SDK

```
cpu: Intel(R) Core(TM) i7-7600U CPU @ 2.80GHz
runtime: deno 1.44.1 (x86_64-unknown-linux-gnu)

benchmark                                                     time (avg)        iter/s             (min … max)       p75       p99      p995
-------------------------------------------------------------------------------------------------------------- -----------------------------
Test authentication (JS-SDK)                                 307.06 ms/iter           3.3 (283.31 ms … 333.73 ms) 315.97 ms 333.73 ms 333.73 ms
Test all CRUD operations on the Cats collection (JS-SDK)      11.96 ms/iter          83.6    (9.42 ms … 15.98 ms) 12.47 ms 15.98 ms 15.98 ms
Test Auth Clear (JS-SDK)                                       5.61 µs/iter     178,157.9     (3.37 µs … 8.36 µs) 7.28 µs 8.36 µs 8.36 µs
```

### PBD (TypeScript)

```
cpu: Intel(R) Core(TM) i7-7600U CPU @ 2.80GHz
runtime: deno 1.44.1 (x86_64-unknown-linux-gnu)

benchmark                                                   time (avg)        iter/s             (min … max)       p75       p99      p995
------------------------------------------------------------------------------------------------------------ -----------------------------
Test authentication (PBDQ)                                 274.06 ms/iter           3.6 (251.94 ms … 292.13 ms) 285.75 ms 292.13 ms 292.13 ms
Test all CRUD operations on the Cats collection (PBDQ)       9.55 ms/iter         104.7    (7.89 ms … 25.74 ms) 9.76 ms 25.74 ms 25.74 ms
Test Auth Clear (PBDQ)                                       4.75 µs/iter     210,347.6     (3.09 µs … 6.72 µs) 5.87 µs 6.72 µs 6.72 µs
```

## Node 🟢

### Pocketbase JS SDK

### PBD (TypeScript)

## Bun 🥟

### Pocketbase JS SDK

### PBD (TypeScript)
