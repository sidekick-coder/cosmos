export default class Stack {
    public name: string
    public folder: string
    public file: string
    public alias?: string[]
    public content?: string

    constructor(data: Partial<Stack>) {
        Object.assign(this, data)
    }
}
