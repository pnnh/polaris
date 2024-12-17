import NodeCache from "node-cache"

// 文章阅读数缓存
export const articleViewerCache = new NodeCache({stdTTL: 3600 * 24, checkperiod: 300});

// 评论次数缓存
const commentsCache = new NodeCache({stdTTL: 3600, checkperiod: 30});

// 验证评论次数缓存
export function verifyCache(fingerprint: string, ipaddress: string): boolean {
    const key = `${fingerprint}-${ipaddress}`
    const value = commentsCache.get(key)
    if (!value) {
        commentsCache.set(key, '1')
        return true
    }
    const intValue = parseInt(value as string)
    if (isNaN(intValue)) {
        commentsCache.set(key, '1')
        return true
    } else if (intValue >= 5) {
        return false
    }
    commentsCache.set(key, (intValue + 1).toString())
    return true
}
