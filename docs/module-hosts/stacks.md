# Stacks Host Module

The Stacks host module allows you to manage `docker-compose.yml` files and application stacks on a remote or local host.

This module provides commands to create, modify, and control stacks, making it easy to orchestrate multi-service environments using Docker Compose.

## Usage

To use the Stacks host module, ensure your host is configured and selected in Cosmos. Then, you can run stack-related commands as follows:

```
cosmos [ip|alias|hostname] stacks [command] [args...]
```

---

## stacks.json

`stacks.json` is a file stored on the host that keeps track of where the `docker-compose.yml` files are located and contains metadata associated with each file. This metadata can include the stack name, aliases, and other relevant information for each stack managed by Cosmos.

**Example:**
```json
{
  "files": [
    "/home/ubuntu/my-app/docker-compose.yml"
  ],
  "folders": [
    "/opt/stacks"
  ],
  "metadata": {
    "/home/ubuntu/my-app/docker-compose.yml": {
      "name": "app",
      "alias": [
        "a"
      ]
    },
    "/opt/stacks/another-app/docker-compose.yml": {
      "name": "another-app",
      "alias": [
        "ap"
      ]
    },
  }
}
```

---

## Commands

### create
Create a new stack by registering a new `docker-compose.yml` file. The file is created and its content is stored.

**Example:**
```sh
cosmos myserver stacks create --filename my-stack.yml
```

### edit
Edit an existing stack's `docker-compose.yml` file and its metadata (name, alias).

**Example:**
```sh
cosmos myserver stacks edit my-stack.yml
```

### add-file
Add a file to the stack.

**Example:**
```sh
cosmos myserver stacks add-file --filepath ./local-file.txt
```

### add-folder
Add a folder to the stack.

**Example:**
```sh
cosmos myserver stacks add-folder --folderpath ./my-folder
```

### remove-file
Remove a file from the stack.

**Example:**
```sh
cosmos myserver stacks remove-file --filepath ./local-file.txt
```

### remove-folder
Remove a folder from the stack.

**Example:**
```sh
cosmos myserver stacks remove-folder --folderpath ./my-folder
```

### list
List all stacks registered in the stack registry.

**Example:**
```sh
cosmos myserver stacks list
```

### find
Find a stack by name or filename in the stack registry.

**Example:**
```sh
cosmos myserver stacks find --query my-stack
```

### read
Read the content of a stack's `docker-compose.yml` file.

**Example:**
```sh
cosmos myserver stacks read --query my-stack.yml
```

### start
Start a stack by running `docker compose up -d` using the stack's `docker-compose.yml` file.

**Example:**
```sh
cosmos myserver stacks start my-stack
```

### stop
Stop a stack by running `docker compose down` using the stack's `docker-compose.yml` file.

**Example:**
```sh
cosmos myserver stacks stop my-stack
```

### restart
Restart a stack by running `docker compose down --remove-orphans` and then `docker compose up -d` using the stack's `docker-compose.yml` file.

**Example:**
```sh
cosmos myserver stacks restart my-stack
```