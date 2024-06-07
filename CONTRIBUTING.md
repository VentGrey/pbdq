# Contributing to PBDQ

Thank you for considering contributing to PBDQ! Below are some guidelines and
requirements to follow to maintain the quality and consistency of the project.

## Code Requirements

### Strict Typing

1. **Do not use `any`:** The `any` type should not be used in the code. This
   helps maintain the integrity of TypeScript's type system.
2. **Using `unknown`:** The `unknown` type can be used only if there is no other
   alternative that can be used, again, avoid using `any` at all cost. Make sure
   to properly handle `unknown` values before using them.
3. **Explicit Typing:** All types must be explicit. Avoid type inference.
4. **Keep Types Simple:** One ugly thing abour TypeScript are type gymnastics,
   avoid them.

### Documentation with JSDoc

- **JSDoc Comments:** All methods and functions must be documented with JSDoc.
  This includes the description of the function, parameters, and return value.

  Example:
  ```typescript
  /**
   * Adds two numbers.
   * @param {number} a - The first number.
   * @param {number} b - The second number.
   * @returns {number} The sum of `a` and `b`.
   */
  function add(a: number, b: number): number {
      return a + b;
  }
  ```

## Tests and Examples

- **Tests:** Whenever possible, include tests for your changes. Tests help
  ensure the code works as expected and does not introduce new bugs.
- **Examples:** Including usage examples can be very helpful for other
  developers using the library.

## Formatting and Linting

- **Code Formatting:** All code must be formatted using `deno fmt`
- **Linting:** All code should pass `deno lint` checks

### Useful commands

- Format code:

```bash
deno fmt
```

- Lint code:

```bash
deno lint
```

- Run tests:

```bash
deno test
```

## Contributing

1. Fork the repository
2. Clone the repository and create a new branch
3. Make your changes
4. Run `deno fmt` and `deno lint` on your changes
5. Create a pull request

## Communication

If you have any questions or need help, feel free to open an issue in the
repository.