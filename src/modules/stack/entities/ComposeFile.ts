export default class ComposeFile {
    public name: string
    public folder: string
    public file: string
    public alias: string[] = []

    constructor(data: Partial<ComposeFile>) {
        Object.assign(this, data)
    }
}
