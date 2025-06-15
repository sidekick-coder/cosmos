import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { input } from '@inquirer/prompts'
import { tmpdir } from 'os'
import { join } from 'path'
import { promises as fs } from 'fs'
import { randomUUID } from 'crypto'

export default defineCommand({
    name: 'create',
    options: {
        filename: {
            type: 'flag',
            description: 'Name of the file to create',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)

        let filename = options.filename

        if (!filename) {
            filename = await input({
                message: 'Enter the filename to create:',
            })
        }

        const tmpFile = join(tmpdir(), `cosmos-tmp-${randomUUID()}`)

        await fs.writeFile(tmpFile, '')

        const editor = process.env.EDITOR || 'vi'
        const { spawnSync } = await import('child_process')
        spawnSync(editor, [tmpFile], { stdio: 'inherit' })

        const content = await fs.readFile(tmpFile, 'utf8')

        await repository.create(filename, content)

        await fs.unlink(tmpFile)

        console.log(`File '${filename}' created and registered in stack.`)
    },
})
