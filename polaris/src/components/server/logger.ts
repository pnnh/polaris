import pino from 'pino';

const serverLogger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    // 生产环境：纯 JSON 输出到 stdout，无颜色、无多余字段
    formatters: {
        level(label) {
            return {level: label};
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    // 可选：集成 OpenTelemetry trace
    hooks: {
        logMethod(inputArgs, method) {
            // 可在这里加 trace_id / span_id
            return method.apply(this, inputArgs);
        },
    },
});

if (process.env.NODE_ENV !== 'production') {
    const pinoPretty = (await import('pino-pretty')).default;
    const pretty = pinoPretty({colorize: true, ignore: 'pid,hostname'});
}

export {serverLogger};


export function serverLogDebugMeta(message: string, meta?: any) {
    if (meta && typeof meta === 'object') {
        meta['timestamp'] = new Date().toISOString();
        meta['level'] = 'debug';
        meta['message'] = message;
    } else {
        meta = {timestamp: new Date().toISOString(), level: 'debug', message};
    }
    serverLogger.debug(meta);
}

export function serverLogInfoMeta(message: string, meta?: any) {
    if (meta && typeof meta === 'object') {
        meta['timestamp'] = new Date().toISOString();
        meta['level'] = 'info';
        meta['message'] = message;
    } else {
        meta = {timestamp: new Date().toISOString(), level: 'info', message};
    }
    serverLogger.info(meta);
}

export function serverLogWarnMeta(message: string, meta?: any) {
    if (meta && typeof meta === 'object') {
        meta['timestamp'] = new Date().toISOString();
        meta['level'] = 'warn';
        meta['message'] = message;
    } else {
        meta = {timestamp: new Date().toISOString(), level: 'warn', message};
    }
    serverLogger.warn(meta);
}

export function serverLogErrorMeta(message: string, meta?: any) {

    if (meta && typeof meta === 'object') {
        meta['timestamp'] = new Date().toISOString();
        meta['level'] = 'error';
        meta['message'] = message;
    } else {
        meta = {timestamp: new Date().toISOString(), level: 'error', message};
    }
    serverLogger.error(meta);
}
