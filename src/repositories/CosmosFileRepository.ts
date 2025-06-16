import Host from '@/entities/Host.js'
import { createFs, type CosmosFilesystem } from '@/gateways/createFs.js'
import { tryCatch } from '@/utils/tryCatch.js'
import { homedir } from 'os'
import path from 'path'

export class CosmosFileRepository {
    public cosmosDir: string = '~/.cosmos'
    private fs: CosmosFilesystem
    public host: Host

    constructor(host: Host) {
        this.host = host
        this.fs = createFs(host)

        if (host.Host === 'localhost') {
            this.cosmosDir = path.join(homedir(), '.cosmos')
        }
    }

    static local(): CosmosFileRepository {
        const host = new Host({ Host: 'localhost' })

        return new CosmosFileRepository(host)
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
