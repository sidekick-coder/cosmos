import type { ConnectConfig } from 'ssh2'
import type { ExecuteOptions } from './createClient.js'
import { createClient } from './createClient.js'

export interface CreateShellOptions extends ConnectConfig {}

export function createShell(options: CreateShellOptions) {
    async function command(args: string, opt?: ExecuteOptions): Promise<string> {
        const client = createClient(options)

        try {
            client.connect()

            return await client.exec(args, opt)
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
