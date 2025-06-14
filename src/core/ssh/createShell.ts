import type { ConnectConfig } from 'ssh2'
import { createClient } from './createClient.js'

export interface CreateShellOptions extends ConnectConfig {}

export function createShell(options: CreateShellOptions) {
    async function command(args: string): Promise<string> {
        const client = createClient(options)

        try {
            client.connect()

            return await client.exec(args)
        } catch (error) {
            client.disconnect()
            throw error
        } finally {
            await client.disconnect()
        }
    }

    return {
        command,
    }
}
