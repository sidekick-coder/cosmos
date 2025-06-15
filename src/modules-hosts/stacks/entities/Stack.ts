export class StackFile {
    public folder: string
    public file: string
    public id: string
    public name: string

    constructor(data: Partial<StackFile>) {
        Object.assign(this, data)
    }
}
