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
    "/home/ubuntu/apps/docker-compose.yml",
    "/home/ubuntu/stacks/my-app/docker-compose.yml"
  ],
  "folders": [
    "/opt/stacks"
  ],
  "metadata": {
    "/home/ubuntu/stacks/my-app/docker-compose.yml": {
      "name": "my-app",
      "alias": [
        "t"
      ]
    }
  }
}
```

## Create

Create a new stack in the host 

This will prompt you to write a `docker-compose.yml` file that will be uploaded to the host and registered in the `stacks.json` file.

**Arguments:**
- `<filename>`: Name of the file to create.

**Example:**
```sh
cosmos myserver stacks create /opt/stacks/my-app/docker-compose.yml
```

## Edit
Edit a `docker-compose.yml` file and/or its metadata (name, alias) in the host.

This will prompt you to write a `docker-compose.yml` file that will be uploaded to the host if there is a change.

**Arguments:**
- `<query>`: Name or filename to edit.

**Example:**
```sh
cosmos myserver stacks edit my-app
```

## Add file
Register a file in the stack registry. 

This will add the file to the `stacks.json` file in the host.

**Options:**
- `<filename>`: Path to file.

**Example:**
```sh
cosmos myserver stacks add-file /opt/stacks/my-app/docker-compose.yml
```

## Add folder
Add a folder to the stack registry.

**Options:**
- `<folder>`: Path to folder.

**Example:**
```sh
cosmos myserver stacks add-folder /mnt/ebs/stacks
```

## Remove file
Remove a file from the stack registry.

**Options:**
- `<filename>`: Path to file.

**Example:**
```sh
cosmos myserver stacks remove-file /opt/stacks/my-app/docker-compose.yml
```

## Remove folder
Remove a folder from the stack registry.

**Options:**
- `<folder>`: Path to folder.

**Example:**
```sh
cosmos myserver stacks remove-folder /mnt/ebs/stacks
```

## List
List all stacks registered in the stack registry.

**Options:**
- (none)

**Example:**
```sh
cosmos myserver stacks list
```

## Find
Find a stack by name or filename in the stack registry.

**Options:**
- `<query>`: Name or filename to search for.

**Example:**
```sh
cosmos myserver stacks find --query my-app
```

## Read
Read the content of a stack's `docker-compose.yml` file.

**Options:**
- `<query>`: Name or filename to read.

**Example:**
```sh
cosmos myserver stacks read --query my-app.yml
```

## Start
Start a stack by running `docker compose up -d` using the stack's `docker-compose.yml` file.

**Options:**
- `<query>`: Stack to start.

**Example:**
```sh
cosmos myserver stacks start my-app
```

## Stop
Stop a stack by running `docker compose down` using the stack's `docker-compose.yml` file.

**Options:**
- `<query>`: Stack query to stop.

**Example:**
```sh
cosmos myserver stacks stop my-app
```

## Restart
Restart a stack by running `docker compose down --remove-orphans` and then `docker compose up -d` using the stack's `docker-compose.yml` file.

**Options:**
- `<query>`: Stack to restart.

**Example:**
```sh
cosmos myserver stacks restart my-app
```