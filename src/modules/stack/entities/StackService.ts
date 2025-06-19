export default class StackService {
    public name: string
    public raw: Record<string, any>

    constructor(data: Record<string, any>) {
        this.name = data.name || data.Name || ''
        this.raw = data
    }
}
