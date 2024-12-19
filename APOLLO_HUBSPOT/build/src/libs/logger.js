var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import winston, { format } from 'winston';
import chalk from 'chalk';
import util from 'util';
var transform = function (info) {
    var args = info[Symbol.for('splat')];
    if (args) {
        info.message = util.format.apply(util, __spreadArray([info.message], args, false));
    }
    return info;
};
var utilFormatter = function () {
    return { transform: transform };
};
var levels = {
    error: { value: 0, color: 'red', icon: '❌' },
    warn: { value: 1, color: 'yellow', icon: '⚠️' },
    info: { value: 2, color: 'blue', icon: 'ℹ️' },
    debug: { value: 3, color: 'dim blue', icon: '🐛' },
};
var extract = function (prop) {
    return Object.entries(levels).reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        acc[key] = value[prop];
        return acc;
    }, {});
};
var level = function () {
    var configLevel = typeof process.env.PAN_CFG_LOG_LEVEL === 'string' &&
        process.env.PAN_CFG_LOG_LEVEL in levels
        ? process.env.PAN_CFG_LOG_LEVEL
        : '';
    var isDevelopment = process.env.NODE_ENV || 'development' === 'development';
    return configLevel ? configLevel : isDevelopment ? 'debug' : 'warn';
};
var colors = extract('color');
winston.addColors(colors);
var transports = [new winston.transports.Stream({ stream: process.stderr })];
var logger = winston.createLogger({
    level: level(),
    levels: extract('value'),
    handleRejections: true,
    handleExceptions: true,
    format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), format(function (info) { return (__assign(__assign({}, info), { icon: extract('icon')[info.level] })); })(), utilFormatter(), winston.format.colorize({ level: true }), winston.format.printf(function (info) {
        var timestamp = info.timestamp, level = info.level, message = info.message, icon = info.icon, namespace = info.namespace;
        return "".concat(chalk.dim("[".concat(timestamp, "]"))).concat(namespace ? ' ' + chalk.bgGray("[".concat(namespace, "]")) : '', " ").concat(icon, " ").concat(level, ": ").concat(message);
    })),
    transports: transports,
    exceptionHandlers: transports,
    rejectionHandlers: transports,
});
export var namespaceLogger = function (namespace) {
    return logger.child({ namespace: namespace });
};
export default logger;
