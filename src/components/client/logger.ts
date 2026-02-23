import browserLogger from 'loglevel';
import {isProduction} from "@/components/client/config/config";

if (isProduction) {
    browserLogger.setLevel('warn');
} else {
    browserLogger.setLevel('debug');
}

if (isProduction && typeof window !== 'undefined') {
    const originalError = browserLogger.error;
    browserLogger.error = (...args) => {
        originalError.apply(browserLogger, args);
    };
}

export default browserLogger;


export function browserLogDebugMeta(message: string, meta?: any | string) {
    if (meta && typeof meta === 'object') {
        meta['timestamp'] = new Date().toISOString();
        meta['level'] = 'debug';
        meta['message'] = message;
    } else {
        meta = {timestamp: new Date().toISOString(), level: 'debug', message};
    }
    browserLogger.debug(meta);
}

export function browserLogInfoMeta(message: string, meta?: any) {
    if (meta && typeof meta === 'object') {
        meta['timestamp'] = new Date().toISOString();
        meta['level'] = 'info';
        meta['message'] = message;
    } else {
        meta = {timestamp: new Date().toISOString(), level: 'info', message};
    }
    browserLogger.info(meta);
}

export function browserLogWarnMeta(message: string, meta?: any) {
    if (meta && typeof meta === 'object') {
        meta['timestamp'] = new Date().toISOString();
        meta['level'] = 'warn';
        meta['message'] = message;
    } else {
        meta = {timestamp: new Date().toISOString(), level: 'warn', message};
    }
    browserLogger.warn(meta);
}

export function browserLogErrorMeta(message: string, meta?: any) {

    if (meta && typeof meta === 'object') {
        meta['timestamp'] = new Date().toISOString();
        meta['level'] = 'error';
        meta['message'] = message;
    } else {
        meta = {timestamp: new Date().toISOString(), level: 'error', message};
    }
    browserLogger.error(meta);
}
