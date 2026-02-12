import {CodeOk, CommonResult, isSupportedLanguage, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import {getDefaultImageUrl} from "@/components/common/note";
import queryString from "query-string";
import {transKey} from "@/components/common/locales/normal";

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
    let url = `${portalUrl}/${lang}/console/community/articles/${uid}`
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
    return selectData;
}
