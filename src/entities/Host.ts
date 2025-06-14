import { readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import type { CreateShellOptions } from '@/core/ssh/createShell.js'

export default class Host {
    public Hostname?: string
    public Host?: string
    public User?: string
    public Port?: string
    public IdentityFile?: string

    constructor(data: Partial<Host>) {
        this.Hostname = data.Hostname
        this.Host = data.Host
        this.User = data.User
        this.Port = data.Port
        this.IdentityFile = data.IdentityFile
    }

    public toShellOptions(): CreateShellOptions {
        const options: CreateShellOptions = {
            host: this.Hostname || this.Host,
            username: this.User,
            port: this.Port ? parseInt(this.Port, 10) : undefined,
        }

        if (this.IdentityFile) {
            let identityFile = Array.isArray(this.IdentityFile)
                ? this.IdentityFile[0]
                : this.IdentityFile

            identityFile = identityFile.startsWith('~')
                ? join(homedir(), identityFile.slice(1))
                : identityFile

            options.privateKey = readFileSync(identityFile, 'utf-8')
        }

        return options
    }
}
