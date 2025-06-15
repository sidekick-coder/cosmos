import type Host from '@/entities/Host.js'
import { CosmosFileRepository } from '@/repositories/CosmosFileRepository.js'
import * as path from 'path'
import { tryCatch } from '@/utils/tryCatch.js'
import type { CosmosFilesystem } from '@/gateways/createFs.js'
import { StackFile } from '../entities/Stack.js'

export class StackRepository {
    private fs: CosmosFilesystem
    private fileRepo: CosmosFileRepository

    constructor(host: Host) {
        this.fileRepo = new CosmosFileRepository(host)
        this.fs = this.fileRepo['fs']
    }

    async list(): Promise<StackFile[]> {
        const content = await this.fileRepo.read('stacks.json')

        const [_e, parsed] = await tryCatch(async () => JSON.parse(content))

        const stacks = [] as StackFile[]

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

            const stack = new StackFile({
                id: f,
                folder: folder,
                file: f,
                name: path.basename(folder),
            })

            stacks.push(stack)
        }

        return stacks
    }

    async create(stack: any): Promise<void> {
        const stacks = await this.list()

        stacks.push(stack)

        await this.fileRepo.write('stacks.json', JSON.stringify(stacks, null, 4))
    }

    async update(index: number, stack: any): Promise<void> {
        const stacks = await this.list()

        stacks[index] = stack

        await this.fileRepo.write('stacks.json', JSON.stringify(stacks, null, 4))
    }

    async destroy(index: number): Promise<void> {
        const stacks = await this.list()

        stacks.splice(index, 1)

        await this.fileRepo.write('stacks.json', JSON.stringify(stacks, null, 4))
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

    async find(query: string): Promise<StackFile | null> {
        const stacks = await this.list()

        for (const item of stacks) {
            if (item.name === query || item.file === query) {
                return item
            }
        }

        return null
    }
}
