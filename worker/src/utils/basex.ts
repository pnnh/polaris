
import {base58xrp,} from '@scure/base';
import md5 from "md5";

/**
 * 将字符串转换为base58编码的字符串
 * @param data - 待编码的字符串
 * @returns base58编码的字符串
 */
export function stringToBase58(data: string): string {
    const enc = new TextEncoder()
    return base58xrp.encode(enc.encode(data))
}

/**
 * 将字符串转换为md5字符串
 * @param data - 待转换的字符串
 * @returns md5字符串
 */
export function stringToMd5(data: string): string {
    const hash = md5(data)
    // 在md5字符串中间插入连字符
    return hash.slice(0, 8) + '-' + hash.slice(8, 12) + '-' + hash.slice(12, 16) + '-' + hash.slice(16, 20) + '-' + hash.slice(20)
}
