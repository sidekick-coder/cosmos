# Host Module

The host module provides commands to manage SSH host entries in your `~/.ssh/config` file. Each command is described below.

## Create a Host

This command allows you to create a new host entry in your SSH config.

### Usage
```sh
cosmos host create --host <host> --hostname <hostname> --user <username> [--port <port>] [--identity-file <path>]
```
### Options
- `--host, -h`: Host alias (required)
- `--hostname, -hn`: Hostname (IP or domain) (required)
- `--user, -u`: Username (required)
- `--port, -p`: Port (default: 22)
- `--identity-file, -i`: Path to private key (default: `~/.ssh/id_rsa`)

**Behavior:**
If any required flag is missing, you will be prompted to provide it interactively.

### Example
Create a host entry for `myserver`:
```sh
cosmos host create --host myserver --hostname 192.168.1.10 --user ubuntu
```

## List Hosts

This command lists all hosts in your SSH config.

### Usage
```sh
cosmos host list
```
### Output
Displays a table with the following columns:
- Host
- Hostname
- User
- Port
- IdentityFile

### Example
List all hosts:
```sh
cosmos host list
```

## Show Host

This command shows details of a specific host in your SSH config.

### Usage
```sh
cosmos host show <host>
```
### Arguments
- `<host>`: The host alias to show details for.

### Output
Displays all details for the specified host.

### Example
Show details for `myserver`:
```sh
cosmos host show myserver
```

## Remove Host

This command removes a host entry from your SSH config.

### Usage
```sh
cosmos host remove <host>
```
### Arguments
- `<name>`: Host alias to remove.

**Behavior:**
If the alias is not provided, you will be prompted to enter it.

### Example
Remove the host entry for `myserver`:
```sh
cosmos host remove myserver
```

## Update Host

This command updates an existing host entry in your SSH config.

### Usage
```sh
cosmos host update <host> [--user <username>] [--port <port>] [--host <alias>] [--hostname <hostname>] [--identity-file <path>]
```
### Arguments
- `<name>`: Host alias to update.

### Options
- `--host, -h`: Host alias
- `--hostname, -h`: Hostname (IP or domain)
- `--user, -u`: Username
- `--port, -p`: Port
- `--identity-file, -i`: Path to private key

**Behavior:**
If the alias is not provided, you will be prompted to enter it. Only the provided fields will be updated.

### Example
Update the user and port for `myserver`:
```sh
cosmos host update myserver --user admin --port 2222
```
