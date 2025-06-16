# SH Host Module

The `sh` host module provides a command to execute shell commands on a specified host.

The command is run in the context of the host, and the output is streamed directly to your terminal.

## Usage

```sh
cosmos [ip|alias|hostname] sh [command] [args...]
```

- `[command] [args...]`: The shell command and its arguments to execute on the host.

**Example**

```sh
cosmos 192.168.1.10 sh ls -la /home/user
```

This will list the contents of `/home/user` on the target host.

## Escaping Arguments

If you need to pass arguments that might be interpreted by your shell (such as wildcards, spaces, or special characters), you should escape them or use `--` to separate the command from the arguments. This ensures the arguments are sent exactly as intended to the remote shell.

For example, to check disk usage in human-readable format:

```sh
cosmos 192.168.1.10 sh -- df -h
```

The `--` tells Cosmos to treat everything after it as arguments for the remote command, preventing your local shell from interpreting them.

## Interactive Shell Access

To enter an interactive shell session on a host, simply omit the command and arguments after `sh` and specify the shell you want to use (e.g., `bash`, `sh`, `zsh`). This will start an interactive shell on the target host, allowing you to run commands as if you were logged in directly.

**Example**

```sh
cosmos 192.168.1.10 sh bash
```

This will open an interactive Bash shell on the host at `192.168.1.10`. You can now run commands interactively as if you were logged in via SSH.
