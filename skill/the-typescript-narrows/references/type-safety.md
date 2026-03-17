# Type Safety

## Never use explicit `any`

**Stance:** Never use `any` as a type annotation. Use `unknown` and narrow before use.

**Why:** `any` disables the type checker for that value. It silently accepts every operation without verifying any of them. If the runtime value does not match what the code assumes, you get a crash with no compile-time warning.

**Do:**
```typescript
function processInput(input: unknown): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  throw new TypeError("Expected a string");
}
```

**Don't:**
```typescript
function processInput(input: any): string {
  return input.toUpperCase(); // No error, no safety
}
```

**Exception:** Third-party libraries with incomplete type definitions may require `any` at integration boundaries. Prefer `as unknown as ExpectedType` over `as any`.

---

## Use `unknown` for values of uncertain type

**Stance:** Default to `unknown` for values whose type is not known at compile time.

**Why:** `unknown` forces callers to narrow before use, catching type errors at compile time instead of runtime. Any value can be assigned to `unknown`, but `unknown` cannot be used until narrowed.

**Do:**
```typescript
function parseResponse(raw: unknown): string {
  if (typeof raw === "object" && raw !== null && "name" in raw) {
    return String((raw as { name: unknown }).name);
  }
  throw new Error("Invalid response shape");
}
```

**Don't:**
```typescript
function parseResponse(raw: any): string {
  return raw.name; // No check, crashes if shape is wrong
}
```

---

## Restrict type assertions to proven-safe patterns

**Stance:** Do not use `as` type assertions unless narrowing is impossible and the assertion is provably safe.

**Why:** Type assertions bypass the compiler. If the assertion is wrong, you get a runtime error with no warning. Unlike type guards, assertions are not checked -- they tell the compiler to trust you.

**Do:**
```typescript
function isUser(value: unknown): value is User {
  return typeof value === "object"
    && value !== null && "id" in value;
}

const data: unknown = fetchData();
if (isUser(data)) {
  console.log(data.id); // Narrowed safely
}
```

**Don't:**
```typescript
const data: unknown = fetchData();
const user = data as User; // No validation
console.log(user.id); // Crashes if data is not a User
```

**Exception:** Test fixtures where the shape is controlled by the test. Interop with untyped APIs where validation happens externally.

---

## Do not use the `!` postfix operator

**Stance:** Never use the `!` non-null assertion operator.

**Why:** `!` tells the compiler a value is not `null` or `undefined` without producing any runtime guard. If you are wrong, the program crashes. The assertion is erased during compilation.

**Do:**
```typescript
const element = document.getElementById("app");
if (element !== null) {
  element.textContent = "Ready";
}
```

**Don't:**
```typescript
const element = document.getElementById("app");
element!.textContent = "Ready"; // Crashes if null
```

---

## Require explicit boolean comparisons

**Stance:** Use explicit comparisons (`=== null`, `!== undefined`, `.length > 0`) instead of truthy/falsy checks.

**Why:** Truthy/falsy checks silently coerce `0`, `""`, and `NaN` to `false`, causing subtle bugs. A count of zero is falsy but valid. An empty string is falsy but may be a legitimate value. Explicit comparisons make intent clear.

**Do:**
```typescript
if (items.length > 0) {
  processItems(items);
}

if (name !== "") {
  greet(name);
}
```

**Don't:**
```typescript
if (items.length) {
  processItems(items); // Skips when length is 0
}

if (name) {
  greet(name); // Skips empty string
}
```

**Exception:** Boolean variables themselves are fine without explicit comparison: `if (isReady)` is clear and unambiguous.

---

## Type catch clause variables as `unknown`

**Stance:** Treat catch clause variables as `unknown` and narrow before accessing properties.

**Why:** Anything can be thrown in JavaScript -- strings, numbers, objects, `undefined`. Assuming the caught value is an `Error` instance will crash if someone throws a non-Error value.

**Do:**
```typescript
try {
  riskyOperation();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unexpected error:", String(error));
  }
}
```

**Don't:**
```typescript
try {
  riskyOperation();
} catch (error) {
  console.error(error.message); // Crashes if not an Error
}
```

---

## Do not return unsafe `any`-typed values

**Stance:** Never return a value typed as `any` from a function with a typed return signature.

**Why:** An `any` return silently poisons the calling code. The caller believes it has a typed value, but the actual data is unchecked. Bugs surface far from where they originate.

**Do:**
```typescript
function loadConfig(raw: unknown): Config {
  if (typeof raw === "object" && raw !== null
      && "port" in raw && "host" in raw) {
    return { port: Number(raw.port), host: String(raw.host) };
  }
  throw new Error("Invalid config");
}
```

**Don't:**
```typescript
function loadConfig(data: string): Config {
  return JSON.parse(data); // Returns any, no validation
}
```
