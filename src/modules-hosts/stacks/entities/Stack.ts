export default class Stack {
    public folder: string
    public file: string
    public id: string
    public name: string
    public content?: string

    constructor(data: Partial<Stack>) {
        Object.assign(this, data)
    }
}
