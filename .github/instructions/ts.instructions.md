---
applyTo: '**/*.ts'
---

# TypeScript Coding Style Guide 


# Never use `else` statements

Wrong:
```js 
if (condition) {
    // Do something
    return;
} 
else {
    // Do something else
}
```
Correct:
```js
if (condition) {
    // Do something
    return;
}
// Do something else
```

if can not use return, use if statements instead of else:
Correct:
```js
if (condition) {
    // Do something
}

if (!condition) {
    // Do something else
}
```

## trycatch

Never use trycatch blocks unless is explicitly required by prompt.

Instead use `tryCatch` utility in the `@/utils/tryCatch` to handle errors in a functional way.

##  Format

Please always format code for maximum readability. That includes:

- indentation: 4 spaces
- no semicolons
- use `const` and `let` instead of `var`
- Adding line breaks between logical blocks.
- Leaving empty lines before and after control structures (e.g., if, try/catch).
- Grouping related code visually.
- Keeping one statement per line.
- use aliases for imports when necessary to avoid long paths.