import { defineHostModule } from '@/utils/defineHostModule.js'
import docker from './commands/docker.js'

export default defineHostModule({
    name: 'docker',
    setup({ commander }) {
        commander.add(docker)
    },
})
