import SSHConfig from 'ssh-config'
import { existsSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import type { CreateShellOptions } from '@/core/ssh/createShell.js'

const SSH_CONFIG_PATH = join(homedir(), '.ssh', 'config')
let SSH_CONFIG_TEXT = ''

if (existsSync(SSH_CONFIG_PATH)) {
    SSH_CONFIG_TEXT = readFileSync(SSH_CONFIG_PATH, 'utf-8')
}

const sshConfig = SSHConfig.parse(SSH_CONFIG_TEXT)

export default class Host {
    public Hostname?: string
    public Host?: string
    public User?: string
    public Port?: string
    public IdentityFile?: string

    constructor(name: string) {
        const config = sshConfig.compute(name)

        this.Hostname = Array.isArray(config.Hostname) ? config.Hostname[0] : config.Hostname
        this.Host = Array.isArray(config.Host) ? config.Host[0] : config.Host
        this.User = Array.isArray(config.User) ? config.User[0] : config.User
        this.Port = Array.isArray(config.Port) ? config.Port[0] : config.Port
        this.IdentityFile = Array.isArray(config.IdentityFile)
            ? config.IdentityFile[0]
            : config.IdentityFile
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
