export default class StackContainer {
    public id: string
    public name: string
    public status: string
    public raw: Record<string, any>

    constructor(data: Record<string, any>) {
        this.id = data.Id || data.id || data.ID || ''
        this.name = data.Name || data.name || ''
        this.status = data.Status || data.status || ''
        this.raw = data
    }
}
