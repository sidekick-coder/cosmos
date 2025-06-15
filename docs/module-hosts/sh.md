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
