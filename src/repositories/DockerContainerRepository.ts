import type { CreateShellOptions } from '@/core/ssh/createShell.js'
import { createShell } from '@/core/ssh/createShell.js'
import SSHConfig from 'ssh-config'
import type Connection from '@/entities/Connection.js'
import DockerContainer from '@/entities/DockerContainer.js'
import { readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const SSH_CONFIG_PATH = join(homedir(), '.ssh', 'config')

export default class DockerContainerRepository {
    constructor(public connections: Connection[] = []) {}

    async getSSHOptions(connection: Connection) {
        const options: CreateShellOptions = {
            host: connection.host,
        }

        const sshConfigContent = readFileSync(SSH_CONFIG_PATH, 'utf-8')
        const sshConfig = SSHConfig.parse(sshConfigContent)

        const config = sshConfig.compute(connection.host)

        if (config?.HostName) {
            options.host = Array.isArray(config.HostName) ? config.HostName[0] : config.HostName
        }

        if (config?.User) {
            options.username = Array.isArray(config.User) ? config.User[0] : config.User
        }

        if (config?.Port) {
            options.port = Array.isArray(config.Port)
                ? parseInt(config.Port[0], 10)
                : parseInt(config.Port, 10)
        }

        if (config?.IdentityFile) {
            let identityFile = Array.isArray(config.IdentityFile)
                ? config.IdentityFile[0]
                : config.IdentityFile

            identityFile = identityFile.startsWith('~')
                ? join(homedir(), identityFile.slice(1))
                : identityFile

            options.privateKey = readFileSync(identityFile, 'utf-8')
        }

        return options
    }

    async list() {
        const containers = [] as DockerContainer[]

        for await (const connection of this.connections) {
            const sshOptions = await this.getSSHOptions(connection)

            const shell = createShell(sshOptions)

            const command = 'docker ps --format "{{.ID}} {{.Names}} {{.Image}} {{.Status}}"'

            await shell.connect()

            const output = await shell.exec(command)

            await shell.disconnect()

            const lines = output.trim().split('\n')

            for (const line of lines) {
                const [id, name, image, status] = line.split(' ')

                const container = new DockerContainer({
                    id,
                    connection_id: connection.id,
                    name,
                    image,
                    status,
                })

                containers.push(container)
            }
        }

        return containers
    }
}
