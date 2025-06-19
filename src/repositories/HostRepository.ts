import SSHConfig from 'ssh-config'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import Host from '@/entities/Host.js'
import { CosmosFileRepository } from './CosmosFileRepository.js'

const SSH_CONFIG_PATH = join(homedir(), '.ssh', 'config')

let SSH_CONFIG_TEXT = ''

if (existsSync(SSH_CONFIG_PATH)) {
    SSH_CONFIG_TEXT = readFileSync(SSH_CONFIG_PATH, 'utf-8')
}

const sshConfig = SSHConfig.parse(SSH_CONFIG_TEXT)

export default class HostRepository {
    public fileRepo: CosmosFileRepository

    constructor() {
        this.fileRepo = CosmosFileRepository.local()
    }

    public async list() {
        const hosts: Host[] = []

        const metadata = await this.fileRepo.readJson<Record<string, any>>('hosts.json')

        const defaultConfig = sshConfig.compute('*')

        // add localhost
        hosts.push(
            new Host({
                Host: 'localhost',
                Hostname: 'localhost',
                metadata: metadata?.localhost || {},
            })
        )

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

                    const host = new Host({
                        ...defaultConfig,
                        ...computed,
                        metadata: metadata?.[name] || {},
                    })

                    hosts.push(host)
                }
            }
        }

        return hosts
    }

    public async find(name: string) {
        const all = await this.list()

        const config = all.find((host) => host.Host === name || host.Hostname === name)

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

    public async remove(name: string) {
        const host = await this.find(name)

        if (!host) {
            throw new Error(`Host "${name}" not found`)
        }

        sshConfig.remove({ Host: host.Host || host.Hostname })

        writeFileSync(SSH_CONFIG_PATH, SSHConfig.stringify(sshConfig))
    }

    public async update(name: string, data: Partial<Host>) {
        const host = await this.find(name)

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

    public async updateMetadata(name: string, metadata: Record<string, any>) {
        const host = await this.find(name)

        if (!host) {
            throw new Error(`Host "${name}" not found`)
        }

        let all = await this.fileRepo.readJson<Record<string, any>>('hosts.json')

        if (!all) {
            all = {}
        }

        const newMetadata = all[name] || {}

        Object.keys(metadata).forEach((key) => {
            if (metadata[key] === undefined || metadata[key] === null) {
                return delete newMetadata[key]
            }

            newMetadata[key] = metadata[key]
        })

        all[name] = newMetadata

        console.log(newMetadata)

        await this.fileRepo.writeJson('hosts.json', all)
    }
}
