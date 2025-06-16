# Container Module

The container module in Cosmos provides commands to manage Docker containers across your registered hosts. 

It allows you to list, run, remove, and restart containers on any host that has Docker installed.

## Register a Host for Containers

Before managing containers, you must register a host to let Cosmos know it has Docker installed:

```sh
cosmos container register <host>
```
- `<host>`: The IP, hostname, or alias of the host.

This marks the host as Docker-enabled in Cosmos. To unregister a host:

```sh
cosmos container unregister <host>
```

## List Containers

List all containers across all registered Docker hosts:

```sh
cosmos container list
```

This will display a table of containers, including their name, image, status, and host.

## Run a Container

Run a new container on a registered host:

```sh
cosmos container run --hostname <host>
```
- `--hostname, -h`: The hostname, IP, or alias of the target host. If not provided, you will be prompted for it.

You will be prompted for any required information if not provided as flags.

### Examples 

Run a hello world container on a registered host:
```sh
cosmos container run --h myserver --rm myserver hello-world
```
Run a temporary Ubuntu container with an interactive shell:
```sh
cosmos container run --h myserver --rm -it ubuntu bash
```

## Remove a Container

Remove one or more containers from a registered host:

```sh
cosmos container remove --hostname <host> <container1> [<container2> ...]
```
- `--hostname, -h`: The hostname, IP, or alias of the target host. If not provided, you will be prompted for it.
- `<container1> [<container2> ...]`: One or more container names or IDs to remove. You can specify multiple containers separated by spaces. If not provided, you will be prompted for them.

### Examples

Remove a container named `web1` from host `myserver`:
```sh
cosmos container remove --hostname myserver web1
```

Remove multiple containers from host `myserver`:
```sh
cosmos container remove --hostname myserver web1 web2 web3
```

## Restart Containers

Restart containers on one or more hosts:

```sh
cosmos container restart [--hosts <host1,host2,...>] [--names <container1,container2,...>]
```
- `--hosts, -h`: Comma-separated list of hostnames. If omitted, all hosts are targeted (with confirmation).
- `--names, -n`: Comma-separated list of container names. If omitted, all containers are targeted (with confirmation).

If no filters are provided, you will be prompted to confirm restarting all containers.

### Examples

Restart a container named `web1` on host `myserver`:
```sh
cosmos container restart --hosts myserver --names web1
```

Restart all containers on multiple hosts:
```sh
cosmos container restart --hosts myserver,otherserver
```

Restart all containers on all hosts (with confirmation):
```sh
cosmos container restart
```