import {CodeOk, CommonResult, isSupportedLanguage, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import {getDefaultImageUrl} from "@/components/common/note";
import queryString from "query-string";
import {transKey} from "@/components/common/locales/normal";

/**
 * 服务端获取单个笔记详情
 */
export async function serverConsoleGetNote(lang: string, stargateUrl: string, uid: string, wantLang: string = ''): Promise<PSArticleModel | undefined> {
    if (!uid) {
        return undefined
    }
    let url = `${stargateUrl}/console/notes/${uid}`
    if (wantLang && isSupportedLanguage(wantLang)) {
        url += `?wantLang=${wantLang}`
    }
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<CommonResult<PSArticleModel | undefined>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return undefined
    }
    const modelInfo = getResult.data
    if (!modelInfo || !modelInfo.uid) {
        console.warn('笔记信息不完整')
        return undefined
    }
    if (modelInfo.cover) {
        modelInfo.coverUrl = modelInfo.cover.startsWith('http://') || modelInfo.cover.startsWith("https://") ?
            modelInfo.cover : modelInfo.cover
    } else {
        modelInfo.coverUrl = getDefaultImageUrl()
    }
    return getResult.data;
}

/**
 * 服务端查询笔记列表
 */
export async function serverConsoleSelectNotes(stargateUrl: string, lang: string, queryParams: Record<string, any>): Promise<PLSelectData<PSArticleModel>> {
    const rawQuery = queryString.stringify(queryParams)
    const url = `${stargateUrl}/console/notes?${rawQuery}`
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
    return selectData;
}
