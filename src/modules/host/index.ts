import { createCommander } from '@/core/commander/index.js'
import { defineModule } from '@/utils/defineModule.js'
import { resolve } from 'path'

const name = 'host'

export default defineModule({
    name: name,
    setup({ commander }) {
        const sub = createCommander({
            bin: `${commander.config.bin} ${name}`,
        })

        sub.addFolder(resolve(import.meta.dirname, 'commands'))

        commander.addSubCommander(name, sub)
    },
})
