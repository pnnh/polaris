import {base64url, base64} from 'rfc4648'
import {parse as uuidParse, v4 as uuidv4} from 'uuid';
import {base58xrp,} from '@scure/base';
import md5 from "md5";

/**
 * 将字符串转换为base64编码的字符串
 * @param state - 待编码的字符串
 * @param urlEncode
 * @returns base64编码的字符串
 */
export function encodeBase64String(state: string, {urlEncode}: { urlEncode: boolean } = {urlEncode: true}): string {
    const enc = new TextEncoder()
    const data = enc.encode(state)
    return urlEncode ? base64url.stringify(data) : base64.stringify(data)
}

/**
 * 将base64编码的字符串转换为字符串
 * @param base64State - 待解码的base64编码的字符串
 * @param urlEncode
 * @returns 解码后的字符串
 */
export function decodeBase64String(base64State: string, {urlEncode}: {
    urlEncode: boolean
} = {urlEncode: true}): string {
    const stateData = urlEncode ? base64url.parse(base64State) : base64.parse(base64State)
    const decoder = new TextDecoder()
    return decoder.decode(stateData)
}

export function binaryToBase58String(data: Uint8Array): string {
    return base58xrp.encode(data)
}

export function stringToUuid(uuidString: string) {
    return uuidParse(uuidString).toString();
}

export function uuidToBase58(uuidString: string) {
    const data = uuidParse(uuidString);
    // 需要和服务器上的实现保持一致
    return base58xrp.encode(data);
}

export function base58ToUuid(base58String: string) {
    const data = base58xrp.decode(base58String);
    return uuidv4({random: data});
}

/**
 * 将字符串转换为base58编码的字符串
 * @param data - 待编码的字符串
 * @returns base58编码的字符串
 */
export function stringToBase58(data: string): string {
    const enc = new TextEncoder()
    const bytes = enc.encode(data)
    return base58xrp.encode(bytes)
}

/**
 * 将base58编码的字符串转换为字符串
 * @param data - 待解码的base58编码的字符串
 * @returns 解码后的字符串
 */
export function base58ToString(data: string): string {
    const dec = new TextDecoder()
    return dec.decode(base58xrp.decode(data))
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
