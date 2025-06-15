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
    name: 'edit',
    options: {
        query: {
            type: 'arg',
            description: 'Name or filename to edit',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)

        let query = options.query

        if (!query) {
            query = await input({
                message: 'Enter the name or filename to edit:',
            })
        }

        const item = await repository.find(query)

        if (!item) {
            console.log('Stack file not found.')
            return
        }

        const content = await repository.read(query)
        const tmpFile = join(tmpdir(), `cosmos-edit-tmp-${randomUUID()}`)
        await fs.writeFile(tmpFile, content || '')

        const editor = process.env.EDITOR || 'vi'
        const { spawnSync } = await import('child_process')
        spawnSync(editor, [tmpFile], { stdio: 'inherit' })

        const newContent = await fs.readFile(tmpFile, 'utf8')
        await repository.update(query, newContent)
        await fs.unlink(tmpFile)

        console.log(`File '${item.file}' updated in stack.`)
    },
})
