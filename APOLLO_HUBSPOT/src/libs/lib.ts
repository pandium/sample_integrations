export function isTruthy(value: string) {
    return ['true', '1', 't', 'y', 'yes'].includes(value)
}

export class Config {
    [key: string]: string
    constructor() {
        for (const [key, val] of Object.entries(process.env)) {
            if (key.startsWith('PAN_CFG_')) {
                if (!val) continue
                this[key.slice('PAN_CFG_'.length).toLowerCase()] = val
            }
        }
        return this
    }
}

export class Secret {
    [key: string]: string
    constructor() {
        for (const [key, val] of Object.entries(process.env)) {
            if (key.startsWith('PAN_SEC_')) {
                if (!val) continue
                this[key.slice('PAN_SEC_'.length).toLowerCase()] = val
            }
        }
        return this
    }
}

export class Context {
    [key: string]: string
    constructor() {
        for (const [key, val] of Object.entries(process.env)) {
            if (key.startsWith('PAN_CTX_')) {
                if (!val) continue
                this[key.slice('PAN_CTX_'.length).toLowerCase()] = val
            }
        }
        return this
    }
}
