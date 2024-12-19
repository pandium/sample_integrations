import winston, { format } from 'winston'
import chalk from 'chalk'
import util from 'util'

const transform = (info: winston.Logform.TransformableInfo) => {
    const args = info[Symbol.for('splat')]
    if (args) {
        info.message = util.format(info.message, ...args)
    }
    return info
}

const utilFormatter = () => {
    return { transform }
}

type Level = {
    value: number
    color: string
    icon: string
}

type ExtractedValues<T extends keyof Level> = Record<string, Level[T]>

const levels = {
    error: { value: 0, color: 'red', icon: '❌' },
    warn: { value: 1, color: 'yellow', icon: '⚠️' },
    info: { value: 2, color: 'blue', icon: 'ℹ️' },
    debug: { value: 3, color: 'dim blue', icon: '🐛' },
}

const extract = <T extends keyof Level>(prop: T) =>
    Object.entries(levels).reduce((acc, [key, value]) => {
        acc[key] = value[prop]
        return acc
    }, {} as ExtractedValues<T>)

const level = () => {
    const configLevel =
        typeof process.env.PAN_CFG_LOG_LEVEL === 'string' &&
        process.env.PAN_CFG_LOG_LEVEL in levels
            ? process.env.PAN_CFG_LOG_LEVEL
            : ''
    const isDevelopment =
        process.env.NODE_ENV || 'development' === 'development'
    return configLevel ? configLevel : isDevelopment ? 'debug' : 'warn'
}

const colors = extract('color')

winston.addColors(colors)

const transports = [new winston.transports.Stream({ stream: process.stderr })]

const logger = winston.createLogger({
    level: level(),
    levels: extract('value'),
    handleRejections: true,
    handleExceptions: true,
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format((info) => ({ ...info, icon: extract('icon')[info.level] }))(),
        utilFormatter(),
        winston.format.colorize({ level: true }),
        winston.format.printf((info) => {
            const { timestamp, level, message, icon, namespace } = info
            return `${chalk.dim(`[${timestamp}]`)}${
                namespace ? ' ' + chalk.bgGray(`[${namespace}]`) : ''
            } ${icon} ${level}: ${message}`
        })
    ),
    transports,
    exceptionHandlers: transports,
    rejectionHandlers: transports,
})

export const namespaceLogger = (namespace?: string) => {
    return logger.child({ namespace })
}

export default logger
