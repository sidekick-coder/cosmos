import Connection from '@/entities/Connection.js'
import { homedir } from 'os'
import { join } from 'path'
import fs from 'fs/promises'
import { tryCatch } from '../utils/tryCatch.js'

const CONNECTIONS_PATH = join(homedir(), '.cosmos', 'connections.json')

export default class ConnectionRepository {
    private async read(): Promise<Connection[]> {
        const [data, err] = await tryCatch(async () => {
            return await fs.readFile(CONNECTIONS_PATH, 'utf-8')
        })

        if (err) {
            if ((err as any).code === 'ENOENT') return []

            throw err
        }

        const json = JSON.parse(data)

        return Array.isArray(json) ? json.map((item) => new Connection(item)) : []
    }

    private async write(connections: Connection[]): Promise<void> {
        const dir = join(homedir(), '.cosmos')

        await fs.mkdir(dir, { recursive: true })

        const [, writeErr] = await tryCatch(async () =>
            fs.writeFile(CONNECTIONS_PATH, JSON.stringify(connections, null, 2), 'utf-8')
        )

        if (writeErr) throw writeErr
    }

    public async list(): Promise<Connection[]> {
        return this.read()
    }

    public async find(id: string): Promise<Connection | undefined> {
        const connections = await this.read()

        return connections.find((c) => c.id === id)
    }

    public async create(connection: Connection): Promise<void> {
        const connections = await this.read()

        connections.push(connection)

        await this.write(connections)
    }

    public async update(connection: Connection): Promise<void> {
        let connections = await this.read()

        connections = connections.map((c) => (c.id === connection.id ? connection : c))

        await this.write(connections)
    }

    public async destroy(id: string): Promise<void> {
        let connections = await this.read()

        connections = connections.filter((c) => c.id !== id)

        await this.write(connections)
    }
}
