import type Host from '@/entities/Host.js'
import { CosmosFileRepository } from '@/repositories/CosmosFileRepository.js'
import * as path from 'path'
import { tryCatch } from '@/utils/tryCatch.js'
import type { CosmosFilesystem } from '@/gateways/createFs.js'
import Stack from '../entities/Stack.js'

export class StackRepository {
    private fs: CosmosFilesystem
    private fileRepo: CosmosFileRepository

    constructor(host: Host) {
        this.fileRepo = new CosmosFileRepository(host)
        this.fs = this.fileRepo['fs']
    }

    async list(): Promise<Stack[]> {
        const content = await this.fileRepo.read('stacks.json')

        const [_e, parsed] = await tryCatch(async () => JSON.parse(content))

        const stacks = [] as Stack[]

        let files: string[] = []
        let folders: string[] = []

        if (parsed) {
            files = parsed.files || []
            folders = parsed.folders || []
        }

        for (const folder of folders) {
            const subfolders = await this.fs.readdir(folder)

            subfolders.forEach((sf) => files.push(path.join(sf, 'docker-compose.yml')))
        }

        for (const f of files || []) {
            const folder = path.dirname(f)

            const stack = new Stack({
                id: f,
                folder: folder,
                file: f,
                name: path.basename(folder),
            })

            stacks.push(stack)
        }

        return stacks
    }

    async create(filename: string, content: string): Promise<void> {
        await this.fs.write(filename, content)
        await this.addFile(filename)
    }

    async addFile(filename: string): Promise<void> {
        const content = await this.fileRepo.read('stacks.json')

        const [_e, parsed] = await tryCatch(async () => JSON.parse(content))

        const stacks = parsed || {}

        if (!Array.isArray(stacks.files)) {
            stacks.files = []
        }

        stacks.files.push(filename)

        await this.fileRepo.write('stacks.json', JSON.stringify(stacks, null, 4))
    }

    async removeFile(filename: string): Promise<void> {
        const content = await this.fileRepo.read('stacks.json')

        const [_e, parsed] = await tryCatch(async () => JSON.parse(content))

        const stacks = parsed || {}

        if (!Array.isArray(stacks.files)) {
            stacks.files = []
        }

        stacks.files = stacks.files.filter((f: string) => f !== filename)

        await this.fileRepo.write('stacks.json', JSON.stringify(stacks, null, 4))
    }

    async addFolder(folder: string): Promise<void> {
        const content = await this.fileRepo.read('stacks.json')

        const [_e, parsed] = await tryCatch(async () => JSON.parse(content))

        const stacks = parsed || {}

        if (!Array.isArray(stacks.folders)) {
            stacks.folders = []
        }

        stacks.folders.push(folder)

        await this.fileRepo.write('stacks.json', JSON.stringify(stacks, null, 4))
    }

    async removeFolder(folder: string): Promise<void> {
        const content = await this.fileRepo.read('stacks.json')

        const [_e, parsed] = await tryCatch(async () => JSON.parse(content))

        const stacks = parsed || {}

        if (!Array.isArray(stacks.folders)) {
            stacks.folders = []
        }

        stacks.folders = stacks.folders.filter((f: string) => f !== folder)

        await this.fileRepo.write('stacks.json', JSON.stringify(stacks, null, 4))
    }

    async find(query: string): Promise<Stack | null> {
        const stacks = await this.list()

        const item = stacks.find((item) => item.name === query || item.file === query)

        return item || null
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
}
