import { randomUUID } from 'crypto'

export default class Entry {
    public host: string
    public id: string;
    [key: string]: any

    constructor(data?: Partial<Entry>) {
        Object.assign(this, data || {})

        if (!this.id) {
            this.id = randomUUID()
        }
    }
}
