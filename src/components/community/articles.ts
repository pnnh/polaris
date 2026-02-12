import {CodeOk, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import {getDefaultImageUrl} from "@/components/common/note";
import queryString from "query-string";
import {transKey} from "@/components/common/locales/normal";

export class CommunityArticleNodeService {
    static async consoleQueryArticles(portalUrl: string, lang: string, queryParams: Record<string, any>): Promise<PLSelectData<PSArticleModel>> {
        const rawQuery = queryString.stringify(queryParams)
        const url = `${portalUrl}/console/community/articles?${rawQuery}`
        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()
        const getResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, authHeader);
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            throw new Error(transKey(lang, 'articles.getListFailed'));
        }
        const selectData = getResult.data
        if (!selectData || !selectData.range) {
            throw new Error(transKey(lang, 'articles.getListFailed'));
        }
        for (const item of selectData.range) {
            const modelInfo = item
            if (!modelInfo || !modelInfo.uid) {
                console.warn('用户信息不完整', modelInfo.uid)
                continue
            }
            if (modelInfo.cover) {
                modelInfo.coverUrl = modelInfo.cover.startsWith('http://') || modelInfo.cover.startsWith("https://") ?
                    modelInfo.cover : `${portalUrl}/storage${modelInfo.cover}`
            } else {
                modelInfo.coverUrl = getDefaultImageUrl()
            }
        }
        return selectData;
    }

}
