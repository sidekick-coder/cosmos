import type Host from '@/entities/Host.js'
import { createFs, type CosmosFilesystem } from '@/gateways/createFs.js'
import { tryCatch } from '@/utils/tryCatch.js'
import path from 'path'

export class CosmosFileRepository {
    public cosmosDir: string = '~/.cosmos'
    private fs: CosmosFilesystem
    public host: Host

    constructor(host: Host) {
        this.host = host
        this.fs = createFs(host)
    }

    async read(arg: string): Promise<string | null> {
        const filename = path.join(this.cosmosDir, arg)

        const [error, result] = await tryCatch(() => this.fs.read(filename))

        if (error) {
            return null
        }

        return result
    }

    async write(arg: string, content: string): Promise<void> {
        const filename = path.join(this.cosmosDir, arg)
        const dirname = path.dirname(filename)

        await this.fs.mkdir(dirname)
        await this.fs.write(filename, content)
    }
}
