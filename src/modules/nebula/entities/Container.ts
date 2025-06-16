export default class Container {
    public id: string
    public host: string
    public containerId: string
    public name: string
    public image: string
    public status?: string
    public createdAt?: string

    constructor(data: Partial<Container>) {
        Object.assign(this, data)
    }
}
