import createCache from '@emotion/cache'

export default function createEmotionCache() {
    return createCache({key: 'css'});  // 固定 key，确保前后端匹配
}
