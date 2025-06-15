import type Host from '@/entities/Host.js'
import { createLocalFs } from '@/core/fs/createFs.js'
import { createFs as createSshFs } from '@/core/ssh/createFs.js'

export interface CosmosFilesystem {
    readdir(path: string): Promise<string[]>
    read(path: string): Promise<string>
    write(path: string, content: string): Promise<void>
    mkdir(path: string): Promise<void>
    remove(path: string): Promise<void>
}

export function createFs(host: Host): CosmosFilesystem {
    const hostname = host.Hostname || host.Host

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return createLocalFs()
    }

    return createSshFs(host.toShellOptions())
}
