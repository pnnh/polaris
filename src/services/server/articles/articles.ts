import {CodeOk, CommonResult, PLSelectData, PLSelectResult} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/photon/common/models/article";
import {serverMakeGet} from "@/atom/server/http";
import {cookies} from "next/headers";
import {getDefaultImageUrl} from "@/services/common/note";
import {getLangDefault, isSupportedLanguage, langEn, localText} from "@/atom/common/language";
import queryString from "query-string";

export async function serverGetArticle(portalUrl: string, uid: string): Promise<PSArticleModel | undefined> {
    if (!uid) {
        return undefined
    }
    const url = `${portalUrl}/articles/${uid}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<CommonResult<PSArticleModel | undefined>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return undefined
    }
    const modelInfo = getResult.data
    if (!modelInfo || !modelInfo.uid) {
        console.warn('用户信息不完整')
        return undefined
    }
    if (modelInfo.cover) {
        modelInfo.coverUrl = modelInfo.cover.startsWith('http://') || modelInfo.cover.startsWith("https://") ?
            modelInfo.cover : `${portalUrl}/storage${modelInfo.cover}`
    } else {
        modelInfo.coverUrl = getDefaultImageUrl()
    }
    return getResult.data;
}

export async function serverConsoleGetArticle(lang: string, portalUrl: string, uid: string, wantLang: string = ''): Promise<PSArticleModel | undefined> {
    if (!uid) {
        return undefined
    }
    let url = `${portalUrl}/${lang}/console/articles/${uid}`
    if (wantLang && isSupportedLanguage(wantLang)) {
        if (!isSupportedLanguage(wantLang)) {
            throw new Error(`serverConsoleGetArticle unsupported language: ${wantLang}`);
        }
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
        console.warn('用户信息不完整')
        return undefined
    }
    if (modelInfo.cover) {
        modelInfo.coverUrl = modelInfo.cover.startsWith('http://') || modelInfo.cover.startsWith("https://") ?
            modelInfo.cover : `${portalUrl}/storage${modelInfo.cover}`
    } else {
        modelInfo.coverUrl = getDefaultImageUrl()
    }
    return getResult.data;
}

export async function serverConsoleSelectArticles(portalUrl: string, lang: string, queryParams: Record<string, any>): Promise<PLSelectData<PSArticleModel>> {
    const rawQuery = queryString.stringify(queryParams)
    const url = `${portalUrl}/console/articles?${rawQuery}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        throw new Error(localText(lang, '获取文章列表失败', 'Failed to get article list'));
    }
    const selectData = getResult.data
    if (!selectData || !selectData.range) {
        throw new Error(localText(lang, '获取文章列表失败', 'Failed to get article list'));
    }
    return selectData;
}
