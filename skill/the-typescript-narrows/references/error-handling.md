# Error Handling

## Throw only Error subclasses

**Stance:** Only throw instances of `Error` or its subclasses. Never throw strings, numbers, or plain objects.

**Why:** Non-Error throwables lack stack traces, making debugging impossible. Catch handlers that expect `error.message` or `error.stack` crash on primitives. Error subclasses enable `instanceof` checks for typed error handling.

**Do:**

```typescript
throw new Error("User not found");
// or with a custom subclass:
throw new NotFoundError("User", id);
```

**Don't:**

```typescript
throw "User not found";
throw 404;
throw { code: "NOT_FOUND" };
```

---

## Prefer Result types for expected failures

**Stance:** Use a `Result<T, E>` discriminated union for expected, recoverable failures. Reserve `throw` for unexpected bugs and programmer errors.

**Why:** Thrown exceptions are invisible in function signatures -- callers have no idea a function can fail. Result types make failure explicit in the type system, forcing callers to handle both success and error cases at compile time.

**Do:**

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function parseConfig(raw: string): Result<Config, ParseError> {
  const parsed = tryParse(raw);
  if (!parsed) return { ok: false, error: new ParseError("Invalid JSON") };
  return { ok: true, value: parsed };
}
```

**Don't:**

```typescript
function parseConfig(raw: string): Config {
  const parsed = JSON.parse(raw); // Throws on invalid input
  return parsed as Config; // Caller has no idea this can fail
}
```

**Exception:** Functions where failure is truly exceptional (out of memory, network down, corrupted state) can throw. The key question: "Should the caller be forced to handle this?" If yes, use Result.

---

## Use discriminated union errors

**Stance:** Define error types as discriminated unions with a `type` field, not as strings or generic Error subclasses distinguished only by message.

**Why:** String messages are fragile to match against and break with wording changes. Discriminated unions let callers switch on `error.type` with full type narrowing and exhaustive checking -- the compiler catches unhandled error cases.

**Do:**

```typescript
type AppError =
  | { type: "not-found"; id: string }
  | { type: "unauthorized"; reason: string }
  | { type: "validation"; fields: string[] };

function handle(error: AppError) {
  switch (error.type) {
    case "not-found": return `Missing: ${error.id}`;
    case "unauthorized": return `Denied: ${error.reason}`;
    case "validation": return `Invalid: ${error.fields.join(", ")}`;
  }
}
```

**Don't:**

```typescript
throw new Error("NOT_FOUND: user 123");
// Later:
if (error.message.startsWith("NOT_FOUND")) {
  // Fragile -- breaks if message wording changes
}
```

---

## Never swallow errors with empty catch blocks

**Stance:** Never leave a catch block empty. At minimum, log the error. Prefer explicit handling.

**Why:** An empty catch block silently swallows errors, making failures invisible. The application continues in a corrupted state with no indication of what went wrong. Silent failures are harder to debug than loud ones.

**Do:**

```typescript
try {
  await saveData(record);
} catch (error) {
  logger.error("Failed to save record:", error);
}
```

**Don't:**

```typescript
try {
  await saveData(record);
} catch (error) { }
```

**Exception:** If intentionally ignoring an error, add a comment explaining why:

```typescript
try {
  await cache.delete(key);
} catch {
  /* Intentionally ignored: cache miss is not an error */
}
```

---

## Wrap errors with cause when rethrowing

**Stance:** When catching and rethrowing errors, wrap with `new Error('context', { cause: err })`. Never rethrow bare or discard the original.

**Why:** Go-inspired error wrapping (`fmt.Errorf` with `%w`). The cause chain preserves the full error trail for debugging while each layer adds context about what operation failed. Without cause, you lose the original stack trace and error details. ES2022 Error cause is the standard mechanism -- no custom classes needed.

**Do:**
```typescript
try {
  await db.query(sql);
} catch (err) {
  throw new Error(`Failed to execute query: ${sql}`, { cause: err });
}
```

**Don't:**
```typescript
try {
  await db.query(sql);
} catch (err) {
  throw err; // No context added
  // or worse:
  throw new Error("Query failed"); // Original error lost
}
```
