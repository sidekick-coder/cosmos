import type Host from '@/entities/Host.js'
import type EntryRepository from '@/modules/register/repositories/EntryRepository.js'
import Stack from '../entities/Stack.js'
import StackService from '../entities/StackService.js'
import { createShell } from '@/gateways/createShell.js'
import { basename, dirname } from 'path'
import { tryCatch } from '@/utils/tryCatch.js'
import { createFs } from '@/gateways/createFs.js'
import YAML from 'yaml'
import StackContainer from '../entities/StackContainer.js'

export default class StackRepository {
    constructor(
        public host: Host,
        public entryRepository: EntryRepository
    ) {}

    public async list(): Promise<Stack[]> {
        const fs = createFs(this.host)
        const shell = createShell(this.host)

        const allEntries = await this.entryRepository.list()

        const entries = allEntries.filter((e) => e.type === 'docker-compose-file')

        const stacks: Stack[] = []

        for await (const entry of entries) {
            const text = await fs.read(entry.filename)

            const [error, config] = tryCatch.sync(() => YAML.parse(text))

            if (error) {
                continue
            }

            const [errorPs, psOutput] = await tryCatch(() =>
                shell.command(
                    `docker --log-level ERROR compose -f ${entry.filename} ps -a --format json`
                )
            )

            if (errorPs) {
                continue
            }

            const folder = dirname(entry.filename)
            const name = config.name || entry.name || basename(folder)
            const services = [] as StackService[]
            const containers = [] as StackContainer[]

            Object.entries(config.services || {})
                .map((e: [string, any]) => ({
                    name: e[0],
                    ...e[1],
                }))
                .forEach((s) => services.push(new StackService(s)))

            psOutput
                .split('\n')
                .filter(Boolean)
                .map((line) => JSON.parse(line))
                .forEach((c: any) => containers.push(new StackContainer(c)))

            const stack = new Stack({
                name,
                folder,
                services,
                containers,
                host: this.host.Host,
                file: entry.filename,
            })

            stacks.push(stack)
        }

        return stacks
    }
}
