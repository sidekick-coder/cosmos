# Host Module

The host module provides commands to manage SSH host entries in your `~/.ssh/config` file. Each command is described below.

---

## create

**Description:**  
Create a new host entry in `~/.ssh/config`.

**Usage:**  
```sh
cosmos host create [--host <alias>] [--hostname <hostname>] [--user <username>] [--port <port>] [--identity-file <path>]
```

**Flags:**
- `--host, -h`: Host alias (required)
- `--hostname, -hn`: Hostname (IP or domain) (required)
- `--user, -u`: Username (required)
- `--port, -p`: Port (default: 22)
- `--identity-file, -i`: Path to private key (default: `~/.ssh/id_rsa`)

**Behavior:**  
If any required flag is missing, you will be prompted to provide it interactively.

---

## list

**Description:**  
List all hosts in your `~/.ssh/config`.

**Usage:**  
```sh
cosmos host list
```

**Behavior:**  
Displays a table with the following columns:
- Host
- Hostname
- User
- Port
- IdentityFile

---

## show

**Description:**  
Show details of a specific host in `~/.ssh/config`.

**Usage:**  
```sh
cosmos host show <host>
```

**Arguments:**
- `<host>`: The host alias to show details for.

**Behavior:**  
Displays all details for the specified host.

---

## remove

**Description:**  
Remove a host entry from `~/.ssh/config`.

**Usage:**  
```sh
cosmos host remove <name>
```

**Arguments:**
- `<name>`: Host alias to remove.

**Behavior:**  
If the alias is not provided, you will be prompted to enter it.

---

## update

**Description:**  
Update an existing host entry in `~/.ssh/config`.

**Usage:**  
```sh
cosmos host update <name> [--host <alias>] [--hostname <hostname>] [--user <username>] [--port <port>] [--identity-file <path>]
```

**Arguments:**
- `<name>`: Host alias to update.

**Flags:**
- `--host, -h`: Host alias
- `--hostname, -h`: Hostname (IP or domain)
- `--user, -u`: Username
- `--port, -p`: Port
- `--identity-file, -i`: Path to private key

**Behavior:**  
If the alias is not provided, you will be prompted to enter it. Only the provided fields will be updated.

---
