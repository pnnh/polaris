import NodeCache from "node-cache"

// 文章阅读数缓存
export const articleViewerCache = new NodeCache({stdTTL: 3600 * 24, checkperiod: 300});
