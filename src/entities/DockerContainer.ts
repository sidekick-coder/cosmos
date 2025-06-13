import type Connection from './Connection.js'

export default class DockerContainer {
    public id: string
    public connection_id: Connection['id']
    public name: string
    public image: string
    public status: string

    constructor(data?: Partial<DockerContainer>) {
        Object.assign(this, data)
    }
}
