export default class Connection {
    public id: string
    public host: string

    constructor(data?: Partial<Connection>) {
        Object.assign(this, data)
    }
}
