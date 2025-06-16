import { defineHostModule } from '@/utils/defineHostModule.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineHostModule({
    name: 'sh',
    setup({ commander }) {
        commander.addFile(resolve(__dirname, 'commands/command.js'))
        commander.addFile(resolve(__dirname, 'commands/sh.js'))
    },
})
