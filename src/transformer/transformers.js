
export default class Transformers {
    constructor() {
        this.map = {}
    }

    set(k, v) {
        this.map[k] = v
    }

    get(k) {
        return this.map[k]
    }
}