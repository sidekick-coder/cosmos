import type { OptionRecord, ParseResult } from './options.js'
import type fs from 'fs'

export interface CommandContext<T extends OptionRecord = OptionRecord> {
    args: string[]
    options: ParseResult<T>
    [key: string]: any
}

export interface Command<T extends OptionRecord = OptionRecord> {
    name: string
    description?: string
    category?: string
    commander?: string
    options?: T
    execute(ctx: CommandContext<T>): Promise<any> | void
}

export interface ConfigHookOptions {
    command: Command
    ctx: CommandContext
}

export interface Config {
    name?: string
    bin?: string
    defaultCommand?: string
    before?: (options: ConfigHookOptions) => void
    after?: (options: ConfigHookOptions) => void
    fs?: typeof fs
    createRequire?: (url: string | URL) => (id: string) => any
}
