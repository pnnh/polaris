import parseUri from 'parse-uri'

// URL地址转换为对象
export function stringToUri(value: string) {
    return parseUri(value)
}

// 校验是否合法URL地址
export function isValidUrl(address: string) {
    try {
        new URL(address);
        return true;
    } catch (err) {
        return false;
    }
}
