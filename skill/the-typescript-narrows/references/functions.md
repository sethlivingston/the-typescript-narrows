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
