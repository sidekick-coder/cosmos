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

> **Warning**: Interactive shells (e.g., `docker run -it ...` or `docker exec -it ...`) are not supported at this time. Running such commands may not work as expected.

### Debugging

Set the `COSMOS_DEBUG` environment variable to see the full command being executed:

```sh
COSMOS_DEBUG=1 cosmos my-server docker ps
```
