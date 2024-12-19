var Metrics = /** @class */ (function () {
    function Metrics() {
        var _this = this;
        this.clientMetrics = {};
        this.syncMetrics = {};
        this.incrementSyncMetrics = function (name, resource, status, amount) {
            var _a;
            if (!_this.syncMetrics[name]) {
                _this.syncMetrics[name] = {};
            }
            if (!_this.syncMetrics[name][resource]) {
                _this.syncMetrics[name][resource] = {};
            }
            _this.syncMetrics[name][resource][status] =
                ((_a = _this.syncMetrics[name][resource][status]) !== null && _a !== void 0 ? _a : 0) + (amount !== null && amount !== void 0 ? amount : 1);
        };
        this.incrementClientMetrics = function (client, resource, action, status, amount) {
            var _a;
            if (!_this.clientMetrics[client]) {
                _this.clientMetrics[client] = {};
            }
            if (!_this.clientMetrics[client][resource]) {
                _this.clientMetrics[client][resource] = {};
            }
            if (!_this.clientMetrics[client][resource][action]) {
                _this.clientMetrics[client][resource][action] = {};
            }
            _this.clientMetrics[client][resource][action][status] =
                ((_a = _this.clientMetrics[client][resource][action][status]) !== null && _a !== void 0 ? _a : 0) +
                    (amount !== null && amount !== void 0 ? amount : 1);
        };
        this.printMetrics = function (logger) {
            for (var _i = 0, _a = Object.entries(_this.syncMetrics); _i < _a.length; _i++) {
                var _b = _a[_i], sync = _b[0], v1 = _b[1];
                for (var _c = 0, _d = Object.entries(v1); _c < _d.length; _c++) {
                    var _e = _d[_c], resource = _e[0], v2 = _e[1];
                    for (var _f = 0, _g = Object.entries(v2); _f < _g.length; _f++) {
                        var _h = _g[_f], result = _h[0], num = _h[1];
                        logger.info("[".concat(sync, " sync] ").concat(resource, " with status ").concat(result, ": ").concat(num));
                    }
                }
            }
            for (var _j = 0, _k = Object.entries(_this.clientMetrics); _j < _k.length; _j++) {
                var _l = _k[_j], client = _l[0], v1 = _l[1];
                for (var _m = 0, _o = Object.entries(v1); _m < _o.length; _m++) {
                    var _p = _o[_m], resource = _p[0], v2 = _p[1];
                    for (var _q = 0, _r = Object.entries(v2); _q < _r.length; _q++) {
                        var _s = _r[_q], action = _s[0], results = _s[1];
                        for (var _t = 0, _u = Object.entries(results); _t < _u.length; _t++) {
                            var _v = _u[_t], result = _v[0], num = _v[1];
                            logger.info("[".concat(client, " client] ").concat(resource, " ").concat(action, " with status ").concat(result, ": ").concat(num));
                        }
                    }
                }
            }
        };
    }
    return Metrics;
}());
export default Metrics;
