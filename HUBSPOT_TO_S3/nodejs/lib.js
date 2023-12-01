function isTruthy(value) {
    return ['true', '1', 't', 'y', 'yes'].includes(value)
}

class Config {
    static from_env() {
        for (const [key, val] of Object.entries(process.env)) {
            if (key.startsWith('PAN_CFG_')) {
                this[key.slice('PAN_CFG_'.length).toLowerCase()] = val
            }
        }
        return this
    }
}

class Secret {
    static from_env() {
        for (const [key, val] of Object.entries(process.env)) {
            if (key.startsWith('PAN_SEC_')) {
                this[key.slice('PAN_SEC_'.length).toLowerCase()] = val
            }
        }
        return this
    }
}

class Context {
    static from_env() {
        for (const [key, val] of Object.entries(process.env)) {
            if (key.startsWith('PAN_CTX_')) {
                this[key.slice('PAN_CTX_'.length).toLowerCase()] = val
            }
        }
        return this
    }
}

module.exports = {
    Config,
    Context,
    Secret,
    isTruthy
}
