import winston from 'winston'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'polaris'},
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    ],
});


export function logDebugValues(message: string, ...values: unknown[]) {
    const meta: Record<string, unknown> = {};
    if (values.length === 0) {
        logger.debug(message);
        return;
    }
    values.forEach((value, index) => {
        if (typeof value === 'object' && value !== null) {
            meta[`value${index}`] = JSON.stringify(value, null, 2);
        } else {
            meta[`value${index}`] = value;
        }

    })
    logger.debug(message, meta);
}

export function logDebugMeta(message: string, meta?: Record<string, unknown>) {
    logger.debug(message, meta);
}

export function logInfoMeta(message: string, meta?: Record<string, unknown>) {
    logger.info(message, meta);
}

export function logInfoValues(message: string, ...values: unknown[]) {
    const meta: Record<string, unknown> = {};
    if (values.length === 0) {
        logger.info(message);
        return;
    }
    values.forEach((value, index) => {
        if (typeof value === 'object' && value !== null) {
            meta[`value${index}`] = JSON.stringify(value, null, 2);
        } else {
            meta[`value${index}`] = value;
        }
    })
    logger.info(message, meta);
}

export function logWarnMeta(message: string, meta?: Record<string, unknown>) {
    logger.warn(message, meta);
}

export function logWarnValues(message: string, ...values: unknown[]) {
    const meta: Record<string, unknown> = {};
    if (values.length === 0) {
        logger.warn(message);
        return;
    }
    values.forEach((value, index) => {
        if (typeof value === 'object' && value !== null) {
            meta[`value${index}`] = JSON.stringify(value, null, 2);
        } else {
            meta[`value${index}`] = value;
        }
    })
    logger.warn(message, meta);
}

export function logErrorMeta(message: string, meta?: Record<string, unknown>) {
    logger.error(message, meta);
}

export function logErrorValues(message: string, ...values: unknown[]) {
    const meta: Record<string, unknown> = {};
    if (values.length === 0) {
        logger.error(message);
        return;
    }
    values.forEach((value, index) => {
        if (typeof value === 'object' && value !== null) {
            meta[`value${index}`] = JSON.stringify(value, null, 2);
        } else {
            meta[`value${index}`] = value;
        }
    })
    logger.error(message, meta);
}
