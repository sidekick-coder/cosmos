import type Host from '@/entities/Host.js'
import { createShell as createSshShell, type CreateShellOptions } from '@/core/ssh/createShell.js'
import { spawn } from 'child_process'

export interface CosmosShellCommandOptions {
    onData?: (data: string) => void
}

export interface CosmosShell {
    command(args: string, options?: CosmosShellCommandOptions): Promise<string>
}

export function createSSHCosmosShell(options: CreateShellOptions): CosmosShell {
    const ssh = createSshShell(options)

    async function command(args: string, _options?: CosmosShellCommandOptions): Promise<string> {
        return await ssh.command(args, {
            onData: (data) => {
                _options?.onData?.(data)
            },
            onStderr: (data) => {
                _options?.onData?.(data)
            },
        })
    }

    return {
        command,
    }
}

export function createLocalCosmosShell(): CosmosShell {
    async function command(args: string, options?: CosmosShellCommandOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            const child = spawn(args, {
                shell: true,
            })

            let output = ''

            child.stdout.on('data', (data) => {
                const str = data.toString()
                output += str
                options?.onData?.(str)
            })

            child.stderr.on('data', (data) => {
                const str = data.toString()
                output += str
                options?.onData?.(str)
            })

            child.on('close', (code) => {
                if (code === 0) {
                    resolve(output)
                }
                reject(new Error(`Process exited with code ${code}`))
            })
        })
    }

    return {
        command,
    }
}

export function createShell(host: Host): CosmosShell {
    const hostname = host.Hostname || host.Host

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return createLocalCosmosShell()
    }

    return createSSHCosmosShell(host.toShellOptions())
}
