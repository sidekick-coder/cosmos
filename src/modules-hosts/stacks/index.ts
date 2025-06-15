import { defineHostModule } from '@/utils/defineHostModule.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const name = 'stacks'

export default defineHostModule({
    name: name,
    description: 'Manage stacks on the host',
    setup({ commander }) {
        const sub = commander.createSubCommander(name, {
            bin: `${commander.config.bin} ${name}`,
        })

        sub.addFolder(resolve(__dirname, 'commands'))
    },
})
