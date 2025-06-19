import type StackContainer from './StackContainer.js'
import type StackService from './StackService.js'

export default class Stack {
    public host: string
    public name: string
    public folder: string
    public file: string
    public services: StackService[] = []
    public containers: StackContainer[] = []

    constructor(data: Partial<Stack>) {
        Object.assign(this, data)
    }
}
