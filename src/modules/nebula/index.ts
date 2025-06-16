import { defineModule } from '@/utils/defineModule.js'
import { resolve } from 'path'

const name = 'nebula'

export default defineModule({
    name: name,
    setup({ commander }) {
        const main = commander.createSubCommander(name, {
            bin: name,
        })

        // container
        const container = main.createSubCommander('container', {
            bin: `nebula container`,
        })

        container.addFolder(resolve(import.meta.dirname, 'commands/container'))

        // source
        const source = main.createSubCommander('source', {
            bin: `nebula source`,
        })

        source.addFolder(resolve(import.meta.dirname, 'commands/source'))
    },
})
