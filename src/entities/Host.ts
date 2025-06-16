import { existsSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import type { CreateShellOptions } from '@/core/ssh/createShell.js'

export default class Host {
    public Hostname?: string
    public Host?: string
    public User?: string
    public Port?: string
    public IdentityFile?: string[]
    public metadata = {} as Record<string, any>

    constructor(data: Partial<Host>) {
        this.Hostname = data.Hostname
        this.Host = data.Host
        this.User = data.User
        this.Port = data.Port
        this.IdentityFile = data.IdentityFile
        this.metadata = data.metadata || {}
    }

    public toShellOptions(): CreateShellOptions {
        const options: CreateShellOptions = {
            host: this.Hostname || this.Host,
            username: this.User,
            port: this.Port ? parseInt(this.Port, 10) : undefined,
        }

        let identityFile = this.IdentityFile ? this.IdentityFile.at(-1) : undefined

        if (identityFile && identityFile.startsWith('~')) {
            identityFile = join(homedir(), identityFile.replace(/^~/, ''))
        }

        if (existsSync(identityFile || '')) {
            options.privateKey = readFileSync(identityFile || '', 'utf-8')
        }

        // use id_rsa if no identity file is provided
        if (!options.privateKey && existsSync(join(homedir(), '.ssh', 'id_rsa'))) {
            options.privateKey = readFileSync(join(homedir(), '.ssh', 'id_rsa'), 'utf-8')
        }

        // use id_ed25519 if no identity file is provided
        if (!options.privateKey && existsSync(join(homedir(), '.ssh', 'id_ed25519'))) {
            options.privateKey = readFileSync(join(homedir(), '.ssh', 'id_ed25519'), 'utf-8')
        }

        return options
    }
}
