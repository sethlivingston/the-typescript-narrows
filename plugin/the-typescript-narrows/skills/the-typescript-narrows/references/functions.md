# Functions

## Use arrow functions by default

**Stance:** Use arrow functions by default. Use function declarations only when hoisting is needed.

**Why:** Arrow functions do not rebind `this`, eliminating an entire class of bugs. They are more concise for callbacks and inline usage. Function declarations are justified only for mutual recursion or top-level organization where a function must be callable before its definition.

**Do:**
```typescript
const processItem = (item: Item): Result => {
  const validated = validate(item);
  return transform(validated);
};
```

**Don't:**
```typescript
function processItem(item: Item): Result {
  const validated = validate(item);
  return transform(validated);
}
```

**Exception:** Function declarations are appropriate when hoisting is required (mutual recursion, top-level organization before definition).

---

## Accept interfaces, return concrete types

**Stance:** Accept interfaces in function parameters; return concrete types. Keep inputs narrow and outputs concrete.

**Why:** Go-inspired "accept interfaces, return structs." Narrow input interfaces make functions testable (pass a mock that satisfies only the interface) and reusable (any conforming type works). Concrete return types give callers full type information without casting. This is dependency inversion at the type level.

**Do:**
```typescript
interface Readable {
  read(size: number): Buffer;
}

const processStream = (source: Readable): ProcessedData => {
  const raw = source.read(1024);
  return { bytes: raw.length, content: raw.toString() };
};
```

**Don't:**
```typescript
import { ReadStream } from "fs";

const processStream = (source: ReadStream): Record<string, unknown> => {
  const raw = source.read(1024);
  return { bytes: raw.length, content: raw.toString() };
};
```
