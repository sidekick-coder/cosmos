# Cosmos

Cosmos is a CLI tool for managing infrastructure modules and resources, with a focus on SSH host management and extensibility.

## Features
- Modular command system
- Manage SSH hosts in `~/.ssh/config`
- Module for shell commands
- Module for docker containers management
- Module for stacks (docker-compose) management

## Installation

### Global Installation (Recommended)

Install packages globally using npm:

```sh
npm install -g @sidekick-coder/cosmos
```

Register the `cosmos` alias in your shell:

```sh
# ~/.bashrc or ~/.zshrc
alias cosmos="node $(npm root -g)/@sidekick-coder/cosmos/index.js"
```

Source your shell configuration:

```sh
source ~/.bashrc  # or source ~/.zshrc
```


Now you can run cosmos commands directly:

```sh
cosmos host list
```

### NPX

With NPX there's no need to installation, you can just run the commands directly:

```sh
npx @sidekick-coder/cosmos [command]
```

Example:
```sh
npx @sidekick-coder/cosmos host list
```

## Host Module (Summary)

The host module lets you manage SSH host entries in your `~/.ssh/config` file.

- `create`: Add a new host. Prompts for missing required fields.
- `list`: Show all hosts in a table.
- `show <host>`: Show details for a specific host.
- `remove <name>`: Remove a host entry (prompts if not provided).
- `update <name>`: Update a host entry. Only provided fields are updated; prompts for missing alias.

For full documentation, see [docs/modules/host.md](docs/modules/host.md).
