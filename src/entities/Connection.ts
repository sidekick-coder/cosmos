export default class Connection {
    public id: string
    public host: string

    constructor(data?: Partial<Connection>) {
        this.id = data?.id || ''
        this.host = data?.host || ''
    }
}
