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

## Docs

When writing documentation for commands, follow this example structure:

For this example, we will use the `cosmos container run` command.

```markdown
## Run a Container

This command allows you to run a new container on a specified host.

### Usage

```sh
cosmos container run --hostname <host> [options]
```
### Options

- `--hostname, -h`: The hostname, IP, or alias of the target host. If not provided, you will be prompted for it.

### Examples 

Run a hello world container on a registered host:
```sh
cosmos container run --h myserver --rm myserver hello-world
```
Run a temporary Ubuntu container with an interactive shell:
```sh
cosmos container run --h myserver --rm -it ubuntu bash
```

```
