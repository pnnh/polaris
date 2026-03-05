import {CodeOk, CommonResult, isSupportedLanguage, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSImageModel} from "@/components/common/models/image";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";
import {transKey} from "@/components/common/locales/normal";
import {useServerConfig} from "@/components/server/config";

export async function serverGetImage(portalUrl: string, uid: string): Promise<PSImageModel | undefined> {
    if (!uid) {
        return undefined
    }
    const url = `${portalUrl}/images/${uid}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<CommonResult<PSImageModel | undefined>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return undefined
    }
    const modelInfo = getResult.data
    if (!modelInfo || !modelInfo.uid) {
        console.warn('用户信息不完整')
        return undefined
    }
    // if (modelInfo.cover) {
    //     modelInfo.coverUrl = modelInfo.cover.startsWith('http://') || modelInfo.cover.startsWith("https://") ?
    //         modelInfo.cover : `${portalUrl}/storage${modelInfo.cover}`
    // } else {
    //     modelInfo.coverUrl = getDefaultImageUrl()
    // }
    return getResult.data;
}

export async function serverConsoleGetImage(lang: string, portalUrl: string, uid: string, wantLang: string = ''): Promise<PSImageModel | undefined> {
    if (!uid) {
        return undefined
    }
    let url = `${portalUrl}/${lang}/console/community/images/${uid}`
    if (wantLang && isSupportedLanguage(wantLang)) {
        if (!isSupportedLanguage(wantLang)) {
            throw new Error(`serverConsoleGetImage unsupported language: ${wantLang}`);
        }
        url += `?wantLang=${wantLang}`
    }
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<CommonResult<PSImageModel | undefined>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return undefined
    }
    const modelInfo = getResult.data
    if (!modelInfo || !modelInfo.uid) {
        console.warn('用户信息不完整')
        return undefined
    }
    // if (modelInfo.cover) {
    //     modelInfo.coverUrl = modelInfo.cover.startsWith('http://') || modelInfo.cover.startsWith("https://") ?
    //         modelInfo.cover : `${portalUrl}/storage${modelInfo.cover}`
    // } else {
    //     modelInfo.coverUrl = getDefaultImageUrl()
    // }
    return getResult.data;
}

export async function serverConsoleSelectImages(lang: string, queryParams: Record<string, any>): Promise<PLSelectData<PSImageModel>> {
    const serverConfig = await useServerConfig()
    const stargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const rawQuery = queryString.stringify(queryParams)
    const url = `${stargateUrl}/console/images?${rawQuery}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<PLSelectResult<PSImageModel>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        throw new Error(transKey(lang, 'images.getListFailed'));
    }
    const selectData = getResult.data
    if (!selectData || !selectData.range) {
        throw new Error(transKey(lang, 'images.getListFailed'));
    }
    return selectData;
}
