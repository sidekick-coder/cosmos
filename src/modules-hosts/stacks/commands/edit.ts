import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { input } from '@inquirer/prompts'
import { tmpdir } from 'os'
import { join } from 'path'
import { promises as fs } from 'fs'
import { randomUUID } from 'crypto'
import { spawnSync } from 'child_process'

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

        // Prompt for name and alias before editing
        const newName = await input({
            message: `Edit name [${item.name}]:`,
            default: item.name || '',
        })

        const aliasInput = await input({
            message: `Edit alias (comma separated) [${(item.alias || []).join(',')}] :`,
            default: (item.alias || []).join(','),
        })

        const newAlias = aliasInput
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean)

        const content = await repository.read(query)

        const tmpFile = join(tmpdir(), `cosmos-edit-tmp-${randomUUID()}`)

        await fs.writeFile(tmpFile, content || '')

        const editor = process.env.EDITOR || 'vi'

        spawnSync(editor, [tmpFile], { stdio: 'inherit' })

        const newContent = await fs.readFile(tmpFile, 'utf8')
        await fs.unlink(tmpFile)

        if (newContent !== content) {
            console.log('Changes file content, updating...')

            await repository.update(query, newContent)
        }

        const metadataChanged =
            newName !== item.name || JSON.stringify(newAlias) !== JSON.stringify(item.alias || [])

        if (metadataChanged) {
            console.log('Updating metadata...')
            await repository.updateMetadata(item.file, {
                name: newName,
                alias: newAlias,
            })
        }

        console.log(`File '${item.file}' updated in stack.`)
    },
})
