export default class Source {
    public host: string
    public description?: string

    constructor(data: Partial<Source>) {
        Object.assign(this, data)
    }
}
