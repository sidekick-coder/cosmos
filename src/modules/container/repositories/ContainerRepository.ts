import type Host from '@/entities/Host.js'
import { createShell } from '@/gateways/createShell.js'
import Container from '../entities/Container.js'

export default class ContainerRepository {
    private host: Host

    constructor(host: Host) {
        this.host = host
    }

    async list(): Promise<Container[]> {
        const shell = createShell(this.host)
        const output = await shell.command('docker ps -a --format "{{json .}}"')

        const lines = output.split('\n').filter(Boolean)
        const containers = lines.map((line) => {
            const data = JSON.parse(line)
            const name = data.Names

            return new Container({
                host: this.host.Host || this.host.Hostname || '',
                containerId: data.ID,
                name: name,
                image: data.Image,
                status: data.Status,
                createdAt: data.CreatedAt,
            })
        })

        return containers
    }
}
