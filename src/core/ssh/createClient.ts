import type { ConnectConfig } from 'ssh2'
import { Client } from 'ssh2'

export interface CreateClientOptions extends ConnectConfig {}

export interface ExecuteOptions {
    onData?: (data: string) => void
    onStderr?: (data: string) => void
}

export function createClient(options: CreateClientOptions) {
    const connection = new Client()

    function connect() {
        connection.connect(options)
    }

    function disconnect() {
        return new Promise<void>((resolve, reject) => {
            connection.end()
            connection.on('close', () => {
                resolve()
            })
            connection.on('error', (err) => {
                reject(err)
            })
        })
    }

    async function exec(command: string, opts?: ExecuteOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            connection.on('ready', () => {
                connection.exec(command, (err, stream) => {
                    if (err) {
                        connection.end()
                        reject(err)
                        return
                    }

                    let stdout = ''
                    let stderr = ''

                    stream.on('close', (code: number, _signal: string) => {
                        connection.end()
                        if (code === 0) {
                            resolve(stdout)
                            return
                        }
                        reject(new Error(stderr || `Command failed with code ${code}`))
                    })

                    stream.on('data', (data: Buffer) => {
                        stdout += data.toString()
                        opts?.onData?.(data.toString())
                    })

                    stream.stderr.on('data', (data: Buffer) => {
                        stderr += data.toString()
                        opts?.onStderr?.(data.toString())
                    })
                })
            })

            connection.on('error', reject)
        })
    }

    return {
        connect,
        disconnect,
        exec,
        connection,
    }
}
