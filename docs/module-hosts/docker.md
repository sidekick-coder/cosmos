# Docker Host Module

The Docker host module allows you to run Docker commands on a remote or local host managed by Cosmos. This module provides a seamless way to interact with Docker through the Cosmos CLI, forwarding commands to the target host's Docker installation.

## Usage

To use the Docker host module, ensure your host is configured and selected in Cosmos. Then, you can run Docker commands as follows:

```sh
cosmos [ip|alias|hostname] docker [command] [args...]
```

### Examples

- List containers:
  ```sh
  cosmos myserver docker ps -a
  ```
- Show Docker version:
  ```sh
  cosmos myserver docker version
  ```
- Run a new container:
  ```sh
  cosmos myserver docker run --rm --name hello-world hello-world
  ```
- Run a interactive shell in a container:
  ```sh
  cosmos myserver docker exec -it ubuntu bash
  ```
- Run a interactive shell in a tmp container:
  ```sh
  cosmos myserver docker run -it ubuntu bash
  ```
