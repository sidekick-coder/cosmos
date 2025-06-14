import SSHConfig from 'ssh-config'
import { existsSync, readFileSync } from 'fs'
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

    public find(name: string): Host | null {
        const config = sshConfig.compute(name)

        if (!config) return null

        return new Host(config)
    }
}
