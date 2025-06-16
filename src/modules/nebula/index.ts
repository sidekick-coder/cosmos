import { defineModule } from '@/utils/defineModule.js'
import { resolve } from 'path'

const name = 'nebula'

export default defineModule({
    name: name,
    setup({ commander }) {
        const main = commander.createSubCommander(name, {
            bin: name,
        })

        main.addFolder(resolve(import.meta.dirname, 'commands/containers'))

        // source
        const source = main.createSubCommander('sources', {
            bin: `nebula sources`,
        })

        source.addFolder(resolve(import.meta.dirname, 'commands/sources'))
    },
})
