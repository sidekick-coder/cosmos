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
            console.error('[ssh.shell]:', error)
            client.disconnect()
            throw error
        } finally {
            await client.disconnect()
        }
    }

    async function interactive(initialCommand?: string): Promise<void> {
        const client = createClient(options)
        const conn = client.connection

        return new Promise((resolve, reject) => {
            client.connect()

            const options = {
                term: 'xterm-256color',
            }

            conn.on('ready', () => {
                conn.shell(options, (err, stream) => {
                    if (err) {
                        client.disconnect()
                        reject(err)
                        return
                    }

                    if (initialCommand) {
                        stream.write(initialCommand + '\n')
                    }

                    process.stdin.setRawMode?.(true)
                    process.stdin.resume()
                    process.stdin.pipe(stream)
                    stream.pipe(process.stdout)
                    stream.stderr.pipe(process.stderr)

                    stream.on('close', () => {
                        process.stdin.setRawMode?.(false)
                        process.stdin.unpipe(stream)
                        client.disconnect()
                        resolve()
                    })

                    stream.on('error', (error) => {
                        client.disconnect()
                        reject(error)
                    })
                })
            })
        })
    }

    return {
        command,
        interactive,
    }
}
