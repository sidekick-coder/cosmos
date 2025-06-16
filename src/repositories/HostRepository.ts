import SSHConfig from 'ssh-config'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import Host from '@/entities/Host.js'

const SSH_CONFIG_PATH = join(homedir(), '.ssh', 'config')

let SSH_CONFIG_TEXT = ''

if (existsSync(SSH_CONFIG_PATH)) {
    SSH_CONFIG_TEXT = readFileSync(SSH_CONFIG_PATH, 'utf-8')
}

const sshConfig = SSHConfig.parse(SSH_CONFIG_TEXT)

export default class HostRepository {
    public list(): Host[] {
        const hosts: Host[] = []

        const defaultConfig = sshConfig.compute('*')

        for (const config of sshConfig) {
            if (
                config.type === 1 &&
                config.param === 'Host' &&
                config.value &&
                config.value !== '*'
            ) {
                const names = config.value.toString().split(/\s+/).filter(Boolean)

                for (const name of names) {
                    const computed = sshConfig.compute(name)

                    hosts.push(
                        new Host({
                            ...defaultConfig,
                            ...computed,
                        })
                    )
                }
            }
        }

        return hosts
    }

    public find(name: string): Host {
        const config = sshConfig.compute(name)

        if (!config || !config.Host) {
            return new Host({
                Host: name,
                Hostname: name,
            })
        }

        return new Host(config)
    }

    public create(host: Host): void {
        sshConfig.append({
            Host: host.Host || host.Hostname,
            Hostname: host.Hostname,
            User: host.User,
            Port: host.Port,
            IdentityFile: host.IdentityFile,
        })

        writeFileSync(SSH_CONFIG_PATH, SSHConfig.stringify(sshConfig))
    }

    public remove(name: string): void {
        const host = this.find(name)

        if (!host) {
            throw new Error(`Host "${name}" not found`)
        }

        sshConfig.remove({ Host: host.Host || host.Hostname })

        writeFileSync(SSH_CONFIG_PATH, SSHConfig.stringify(sshConfig))
    }

    public update(name: string, data: Partial<Host>): void {
        const host = this.find(name)

        if (!host) {
            throw new Error(`Host "${name}" not found`)
        }

        sshConfig.remove({ Host: host.Host || host.Hostname })

        sshConfig.append({
            Host: data.Host || host.Host || host.Hostname,
            Hostname: data.Hostname || host.Hostname,
            User: data.User || host.User,
            Port: data.Port || host.Port,
            IdentityFile: data.IdentityFile || host.IdentityFile,
        })

        writeFileSync(SSH_CONFIG_PATH, SSHConfig.stringify(sshConfig))
    }
}
