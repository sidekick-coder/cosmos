import { defineModule } from '@/utils/defineModule.js'
import { resolve } from 'path'

const name = 'container'

export default defineModule({
    name: name,
    setup({ commander }) {
        const main = commander.createSubCommander(name, {
            bin: name,
        })

        main.addFolder(resolve(import.meta.dirname, 'commands'))
    },
})
