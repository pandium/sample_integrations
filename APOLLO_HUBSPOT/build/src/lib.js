export function isTruthy(value) {
    return ['true', '1', 't', 'y', 'yes'].includes(value);
}
var Config = /** @class */ (function () {
    function Config() {
        for (var _i = 0, _a = Object.entries(process.env); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], val = _b[1];
            if (key.startsWith('PAN_CFG_')) {
                if (!val)
                    continue;
                this[key.slice('PAN_CFG_'.length).toLowerCase()] = val;
            }
        }
        return this;
    }
    return Config;
}());
export { Config };
var Secret = /** @class */ (function () {
    function Secret() {
        for (var _i = 0, _a = Object.entries(process.env); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], val = _b[1];
            if (key.startsWith('PAN_SEC_')) {
                if (!val)
                    continue;
                this[key.slice('PAN_SEC_'.length).toLowerCase()] = val;
            }
        }
        return this;
    }
    return Secret;
}());
export { Secret };
var Context = /** @class */ (function () {
    function Context() {
        for (var _i = 0, _a = Object.entries(process.env); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], val = _b[1];
            if (key.startsWith('PAN_CTX_')) {
                if (!val)
                    continue;
                this[key.slice('PAN_CTX_'.length).toLowerCase()] = val;
            }
        }
        return this;
    }
    return Context;
}());
export { Context };
