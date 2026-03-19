# Async and Promises

## Always handle Promise rejections

**Stance:** Every Promise must be awaited, returned, or explicitly voided. Never leave a Promise floating.

**Why:** A floating Promise silently swallows rejections. The error vanishes, leaving the application in a corrupted state with no indication of failure.

**Do:**
```typescript
await sendEmail(user);
// or, if intentionally fire-and-forget:
void sendEmail(user);
```

**Don't:**
```typescript
sendEmail(user); // Floating -- rejection is lost
```

---

## Do not pass Promises where void is expected

**Stance:** Do not pass async functions to callbacks that expect synchronous void returns (event handlers, array methods, etc.).

**Why:** When an async function is passed where void is expected, the returned Promise is silently discarded. Errors in the async function vanish without any indication of failure.

**Do:**
```typescript
button.addEventListener("click", () => {
  save().catch((error) => console.error("Save failed:", error));
});
```

**Don't:**
```typescript
button.addEventListener("click", async () => {
  await save(); // Promise returned to addEventListener, ignored
});
```

---

## Do not mark functions `async` unless they use `await`

**Stance:** Do not mark a function `async` unless it contains `await`. If it just returns a Promise, return it directly.

**Why:** `async` without `await` wraps the return value in an extra Promise layer unnecessarily. It also misleads readers into thinking the function has asynchronous operations that need awaiting.

**Do:**
```typescript
function fetchData(): Promise<Data> {
  return api.get("/data");
}
```

**Don't:**
```typescript
async function fetchData(): Promise<Data> {
  return api.get("/data"); // No await -- async is misleading
}
```

**Exception:** When implementing an interface or abstract method that requires an async signature, the `async` keyword is acceptable even without `await`.

---

## Always `return await` in try/catch blocks

**Stance:** Always use `return await` inside try/catch blocks. Outside try/catch, return the Promise directly.

**Why:** `return promise` inside try/catch exits the try block before the Promise settles -- the catch block never fires on rejection. `return await promise` settles the Promise inside the try block, allowing catch to handle errors.

**Do:**
```typescript
async function getData() {
  try {
    return await fetchData(); // Settles inside try
  } catch (error) {
    handleError(error); // Catches rejections
  }
}
```

**Don't:**
```typescript
async function getData() {
  try {
    return fetchData(); // Exits try before settling
  } catch (error) {
    handleError(error); // Never runs on rejection
  }
}
```

---

## Use async/await over `.then()` chains

**Stance:** Use async/await for asynchronous control flow. Reserve `.then()` for simple one-step transformations.

**Why:** Async/await reads top-to-bottom like synchronous code. `.then()` chains nest, making error handling and debugging harder. Stack traces are clearer with await.

**Do:**
```typescript
const data = await fetchData();
const result = process(data);
return result;
```

**Don't:**
```typescript
fetchData()
  .then((data) => process(data))
  .then((result) => handleResult(result))
  .catch((error) => handleError(error));
```

**Exception:** `.then()` is fine for simple transforms like `promise.then((r) => r.json())` where a full async function would add unnecessary boilerplate.
