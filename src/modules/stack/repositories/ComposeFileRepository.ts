import type Host from '@/entities/Host.js'
import { CosmosFileRepository } from '@/repositories/CosmosFileRepository.js'
import * as path from 'path'
import { tryCatch } from '@/utils/tryCatch.js'
import type { CosmosFilesystem } from '@/gateways/createFs.js'
import ComposeFile from '../entities/ComposeFile.js'

export class ComposeFileRepository {
    private fs: CosmosFilesystem
    private fileRepo: CosmosFileRepository

    constructor(host: Host) {
        this.fileRepo = new CosmosFileRepository(host)
        this.fs = this.fileRepo['fs']
    }

    async readConfig(): Promise<any> {
        const json = await this.fileRepo.readJson<any>('stacks.json')

        return {
            files: json?.files || [],
            folders: json?.folders || [],
            metadata: json?.metadata || {},
        }
    }

    async list(): Promise<ComposeFile[]> {
        const json = await this.fileRepo.readJson<any>('stacks.json')

        if (!json) {
            return []
        }

        const stacks = [] as ComposeFile[]

        const files: string[] = json.files || []
        const folders: string[] = json.folders || []
        const metadata: Record<string, any> = json.metadata || {}

        for (const folder of folders) {
            const subfolders = await this.fs.readdir(folder)

            subfolders.forEach((sf) => files.push(path.join(sf, 'docker-compose.yml')))
        }

        for (const f of files || []) {
            const folder = path.dirname(f)

            const meta = metadata[f] || {}

            const compose = new ComposeFile({
                name: meta.name || path.basename(folder),
                folder: folder,
                file: f,
                alias: meta.alias || [],
            })

            stacks.push(compose)
        }

        return stacks
    }

    async find(query: string): Promise<ComposeFile | null> {
        const stacks = await this.list()

        const item = stacks.find((item) => {
            if (item.name === query) {
                return true
            }

            if (item.file === query) {
                return true
            }

            if (item.alias && item.alias.includes(query)) {
                return true
            }
        })

        return item || null
    }

    async register(filename: string): Promise<void> {
        const json = await this.fileRepo.readJson<any>('stacks.json')

        const config = {
            files: [],
            folders: [],
            metadata: {},
            ...json,
        }

        if (config.files.includes(filename)) return

        config.files.push(filename)

        await this.fileRepo.writeJson('stacks.json', config)
    }

    async unregister(filename: string): Promise<void> {
        const json = await this.fileRepo.readJson<any>('stacks.json')

        const config = {
            files: [],
            folders: [],
            metadata: {},
            ...json,
        }

        config.files = config.files.filter((f: string) => f !== filename)

        await this.fileRepo.writeJson('stacks.json', config)
    }

    async read(query: string): Promise<string | null> {
        const item = await this.find(query)

        if (!item) {
            return null
        }

        const [error, content] = await tryCatch(() => this.fs.read(item.file))

        if (error) {
            return null
        }

        return content
    }

    async update(query: string, content: string): Promise<boolean> {
        const item = await this.find(query)

        if (!item) {
            return false
        }

        await this.fs.write(item.file, content)

        return true
    }

    /**
     * Update the metadata for a given filename in stacks.json
     * @param filename The file whose metadata to update
     * @param metadata The metadata object to set
     */
    async updateMetadata(filename: string, metadata: Record<string, any>): Promise<void> {
        const content = await this.fileRepo.read('stacks.json')
        const [_e, parsed] = await tryCatch(async () => JSON.parse(content))
        const stacks = parsed || {}
        if (typeof stacks.metadata !== 'object' || stacks.metadata === null) {
            stacks.metadata = {}
        }
        stacks.metadata[filename] = metadata
        await this.fileRepo.write('stacks.json', JSON.stringify(stacks, null, 4))
    }
}
