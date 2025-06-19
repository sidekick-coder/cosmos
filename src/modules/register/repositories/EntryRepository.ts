import type Host from '@/entities/Host.js'
import { CosmosFileRepository } from '@/repositories/CosmosFileRepository.js'
import Entry from '../entities/Entry.js'

export class EntryRepository {
    private fileRepo: CosmosFileRepository

    constructor(public host: Host) {
        this.fileRepo = new CosmosFileRepository(host)
    }

    async list(): Promise<Entry[]> {
        const entries = await this.fileRepo.readJson<any[]>('register.json')

        if (!entries) {
            return []
        }

        return entries.map(
            (entry) =>
                new Entry({
                    ...entry,
                    host: this.host.Host,
                })
        )
    }

    async create(entry: Entry): Promise<void> {
        const entries = await this.list()

        entries.push(entry)

        await this.fileRepo.writeJson('register.json', entries)
    }

    async find(id: string): Promise<Entry | null> {
        const entries = await this.list()

        const entry = entries.find((e) => e.id === id)

        return entry || null
    }

    async update(id: string, payload: Partial<Entry>): Promise<Entry> {
        const entries = await this.list()

        const index = entries.findIndex((e) => e.id === id)

        if (index === -1) {
            throw new Error(`Entry with id ${id} not found`)
        }

        const updatedEntry = { ...entries[index], ...payload }

        entries[index] = updatedEntry

        await this.fileRepo.writeJson('register.json', entries)

        return updatedEntry
    }

    async destroy(id: string): Promise<void> {
        const entries = await this.list()

        const updatedEntries = entries.filter((e) => e.id !== id)

        await this.fileRepo.writeJson('register.json', updatedEntries)
    }
}
