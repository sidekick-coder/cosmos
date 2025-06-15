# SH Host Module

The `sh` host module provides a command to execute shell commands on a specified host.

## Command: `sh`

### Description

Executes a shell command on the target host. The command is run in the context of the host, and the output is streamed directly to your terminal.

### Usage

```
cosmos [ip|alias|hostname] sh [command] [args...]
```

- `[command] [args...]`: The shell command and its arguments to execute on the host.

### Example

```
cosmos 192.168.1.10 sh ls -la /home/user
```

This will list the contents of `/home/user` on the target host.

### Notes

- The command removes the `--` argument if present, to avoid issues with argument parsing.
- Output from the remote shell is streamed live to your terminal.

## Escaping Arguments

If you need to pass arguments that might be interpreted by your shell (such as wildcards, spaces, or special characters), you should escape them or use `--` to separate the command from the arguments. This ensures the arguments are sent exactly as intended to the remote shell.

For example, to check disk usage in human-readable format:

```
cosmos 192.168.1.10 sh -- df -h
```

The `--` tells Cosmos to treat everything after it as arguments for the remote command, preventing your local shell from interpreting them.
