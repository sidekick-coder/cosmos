---
applyTo: '**'
---

## Commands 

Use use @inquirer/prompts for user prompts in Node.js applications.

When creating a command you can check this files for reference of how declare args and flags:

- src/core/commander/options.ts
- src/core/commander/defineCommand.ts

## Coding Style Guide 

- never declare options into a single line, always use multiple lines for better readability

## Flags that are required 

When flags are need but where not defined ask the user to define them using `inquirer` prompts.

```ts
export default defineCommand({
  name: 'example',
  description: 'Example command',
  options: {
    requiredFlag: {
      type: 'flag',
      description: 'This flag is required',
    },
  },
  execute: async (options) => {
    let requiredFlag = options.requiredFlag 
    
    if (!requiredFlag) {
      requiredFlag = await input({ message: 'Please provide the required flag value:' })
    }

    console.log(`Required flag value: ${requiredFlag}`)
  },
})
```