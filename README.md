# Todo

- [] make ssh shell.command stream output as it comes in to simulate a real terminal

## Modules 

### Docker module
A module to manage docker commands on all registered hosts.

This will work a little different since user will need to tell a list of hosts to run the command on.

Hosts will be saved in $HOME/.cosmos/docker/hosts.json file, and user can add or remove hosts from this file.

it will be possible to list all containers in all registered hosts, start, stop, remove containers, and more.

## Host modules

### Apps module 
A module to list, add, update, and remove apps from the host.

It will based on docker compose files

For example will have a folder in the target vps with the following structure:

```
root/
├── resources/
├──── app-1.service.yaml
├──── app-2.service.yaml
├──── db.service.yaml
├──── caddy.service.yaml
└── docker-compose.yaml
```
When deploying the app will generate the docker-compose.yaml file based on the services and resources defined in the other files.

Also will generate the caddy.json file what user will use to configure to expose.

Since all apps will live in the same docker network, they will be able to communicate with each other using the service name as hostname.

And the user can expose the app using caddy, nginx, or any other reverse proxy.

### Docker stacks

A module to manage docker stacks or docker compose files on the host.

It will allow the user to create, update, and remove stacks from the host.

It will have a folder in the target vps that will container an array of files and folders where there are docker compose files

/etc/cosmos/stacks/files.json 
```json
{
    "files": [
        "/mnt/ebs/another/docker-compose.yaml",
    ],
    "folders": [
        "/opt/stacks",
        "/home/ubuntu/stacks"
    ]
  
}
```

