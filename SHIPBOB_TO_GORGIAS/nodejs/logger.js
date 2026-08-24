import * as os from 'os'

/** Formats a log line as `<timestamp> <hostname> <module>[<pid>] <LEVEL> <message>`. */
function formatLog(moduleName, level, message) {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
        now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    return `${timestamp} ${os.hostname()} ${moduleName}[${process.pid}] ${level} ${message}`
}

/**
 * A logger scoped to the calling file, named after it. Call once per file with
 * `getLogger(import.meta.url)` and reuse the result; logs go to stderr, stdout is reserved
 * for the JSON metadata Pandium reads back.
 */
export function getLogger(moduleUrl) {
    const moduleName = new URL(moduleUrl).pathname.split('/').pop()?.replace(/\.js$/, '') ?? 'unknown'
    return {
        info: (message) => console.error(formatLog(moduleName, 'INFO', message)),
        error: (message) => console.error(formatLog(moduleName, 'ERROR', message)),
    }
}
