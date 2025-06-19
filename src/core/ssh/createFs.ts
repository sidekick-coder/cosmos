import type { CreateShellOptions } from './createShell.js'
import { createShell } from './createShell.js'

export function createFs(options: CreateShellOptions) {
    const { command } = createShell(options)

    async function exists(path: string): Promise<boolean> {
        const result = await command(`test -e ${path} && echo yes || echo no`)

        return result.trim() === 'yes'
    }

    async function readdir(path: string): Promise<string[]> {
        if (!(await exists(path))) {
            return []
        }

        const result = await command(`ls -1 ${path}`)

        return result.split('\n').filter(Boolean)
    }

    async function read(path: string): Promise<string> {
        if (!(await exists(path))) {
            throw new Error(`File does not exist: ${path}`)
        }

        return await command(`cat ${path}`)
    }

    async function write(path: string, content: string): Promise<void> {
        const contentWithEscapedQuotes = content.replace(/"/g, '\\"')

        await command(`echo "${contentWithEscapedQuotes}" > ${path}`)
    }

    async function mkdir(path: string): Promise<void> {
        await command(`mkdir -p ${path}`)
    }

    async function remove(path: string): Promise<void> {
        await command(`rm -rf ${path}`)
    }

    return {
        readdir,
        read,
        write,
        mkdir,
        remove,
    }
}
