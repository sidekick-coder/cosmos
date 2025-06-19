import type { ConnectConfig } from 'ssh2'
import { Client } from 'ssh2'

export interface CreateClientOptions extends ConnectConfig {}

export interface ExecuteOptions {
    pty?: boolean
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
                connection.exec(command, { pty: true }, (err, stream) => {
                    if (err) {
                        connection.end()
                        reject(err)
                        return
                    }

                    let stdout = ''
                    let stderr = ''

                    if (opts?.pty) {
                        process.stdin.setRawMode(true)
                        process.stdin.resume()
                        process.stdin.pipe(stream)
                        stream.pipe(process.stdout)
                    }

                    stream.on('data', (data: Buffer) => {
                        stdout += data.toString()
                        opts?.onData?.(data.toString())
                    })

                    stream.stderr.on('data', (data: Buffer) => {
                        stderr += data.toString()
                        opts?.onStderr?.(data.toString())
                    })

                    stream.on('close', (code: number, _signal: string) => {
                        if (opts?.pty) {
                            process.stdin.setRawMode(false)
                            process.stdin.unpipe(stream)
                        }

                        connection.end()
                        if (code === 0) {
                            resolve(stdout)
                            return
                        }
                        reject(new Error(stderr || `Command "${command}" failed with code ${code}`))
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
