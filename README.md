# Cosmos (Alpha)

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

## Host Modules

Host Modules are modules that can execute one or more actions on a VPS (Virtual Private Server) via SSH. They allow you to interact with remote hosts by running commands or performing operations directly on the server using its IP address, alias, or hostname.

To run a host module, use the following syntax:

```
cosmos [ip|alias|hostname] <module> [command] [args...]
```

- `[ip|alias|hostname]`: The target host's IP address, alias, or hostname.
- `<module>`: The host module you want to use (e.g., `sh`).
- `[command] [args...]`: The command and its arguments for the module.

### Examples using the `sh` module

List files in a directory:
```
cosmos 192.168.1.10 sh ls -la /home/user
```

Check free memory on the host:
```
cosmos 192.168.1.10 sh free -h
```

## Available Host Modules

- [sh](./module-hosts/sh.md): Execute shell commands on a specified host.
- [docker](./module-hosts/docker.md): Docker CLI commands.
- [stacks](./module-hosts/stacks.md): Manage docker compose files.

### SSH Host Resolution

Cosmos uses your `~/.ssh/config` file to resolve hosts and ssh keys. This means you can use any alias or host defined in your SSH config instead of typing the full IP address each time.

For example, if your `~/.ssh/config` contains:

```
Host myserver
    HostName 192.168.1.10
    User ubuntu

Host another-server
    HostName 192.168.1.12
    User ubuntu
    IdentityFile ~/.ssh/another_key
```

You can run a command using the alias:

```
cosmos myserver sh ls -la /home/ubuntu
```

This will connect to `192.168.1.10` as user `ubuntu` using the settings from your SSH config.
