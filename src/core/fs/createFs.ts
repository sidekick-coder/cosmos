import * as fs from 'fs/promises'

export function createLocalFs() {
    return {
        async readdir(path: string) {
            return await fs.readdir(path)
        },

        async read(path: string) {
            return await fs.readFile(path, 'utf8')
        },

        async write(path: string, content: string) {
            await fs.writeFile(path, content, 'utf8')
        },

        async mkdir(path: string) {
            await fs.mkdir(path, { recursive: true })
        },

        async remove(path: string) {
            await fs.rm(path, { recursive: true, force: true })
        },
    }
}
