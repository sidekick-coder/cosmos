import { CosmosFileRepository } from '@/repositories/CosmosFileRepository.js'
import { tryCatch } from '@/utils/tryCatch.js'
import Source from '../entities/Source.js'

export interface NebulaConfig {
    sources: Source[]
}

const NEBULA_FILE = 'nebula.json'

export default class SourceRepository {
    private repo: CosmosFileRepository

    constructor() {
        this.repo = CosmosFileRepository.local()
    }

    async list(): Promise<Source[]> {
        const content = await this.repo.read(NEBULA_FILE)
        if (!content) return []

        const [error, result] = await tryCatch(() => Promise.resolve(JSON.parse(content)))

        if (error) return []

        const config: NebulaConfig = result
        if (config.sources) {
            return config.sources.map((s) => new Source(s))
        }

        return []
    }

    async create(source: Source): Promise<void> {
        const sources = await this.list()
        sources.push(source)
        await this.save(sources)
    }

    async update(host: string, payload: Partial<Source>): Promise<void> {
        const sources = await this.list()
        const source = sources.find((s) => s.host === host)
        if (!source) {
            throw new Error(`Source with host ${host} not found`)
        }
        source.description = payload.description ?? source.description
        await this.save(sources)
    }

    async delete(host: string): Promise<void> {
        const sources = await this.list()
        const filtered = sources.filter((s) => s.host !== host)
        await this.save(filtered)
    }

    private async save(sources: Source[]): Promise<void> {
        const config: NebulaConfig = { sources }
        await this.repo.write(NEBULA_FILE, JSON.stringify(config, null, 2))
    }
}
