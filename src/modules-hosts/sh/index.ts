import { defineHostModule } from '@/utils/defineHostModule.js'
import sh from './commands/sh.js'

export default defineHostModule({
    name: 'sh',
    description: 'Manage shell commands on the host',
    setup({ commander }) {
        commander.add(sh)
    },
})
