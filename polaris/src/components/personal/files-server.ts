import {CodeOk, CommonResult, isSupportedLanguage, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {getDefaultImageUrl, PSFileModel} from "@/components/common/models/file";
import {useServerConfig} from "@/components/server/config";
import queryString from "query-string";
import {cookies} from "next/headers";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {transKey} from "@/components/common/locales/normal";

export async function serverConsoleSelectFiles(lang: string, queryParams: Record<string, any>): Promise<PLSelectData<PSFileModel>> {
    const serverConfig = await useServerConfig()
    const stargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const rawQuery = queryString.stringify(queryParams)
    const url = `${stargateUrl}/personal/files?${rawQuery}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<PLSelectResult<PSFileModel>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        throw new Error(transKey(lang, 'files.getListFailed'));
    }
    const selectData = getResult.data
    if (!selectData || !selectData.range) {
        throw new Error(transKey(lang, 'files.getListFailed'));
    }
    return selectData;
}

/**
 * 服务端获取单个文件详情
 */
export async function serverConsoleGetFile(lang: string, stargateUrl: string, uid: string, wantLang: string = ''): Promise<PSFileModel | undefined> {
    if (!uid) {
        return undefined
    }
    let url = `${stargateUrl}/personal/notes/${uid}`
    if (wantLang && isSupportedLanguage(wantLang)) {
        url += `?wantLang=${wantLang}`
    }
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<CommonResult<PSFileModel | undefined>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return undefined
    }
    const modelInfo = getResult.data
    if (!modelInfo || !modelInfo.uid) {
        console.warn('文件信息不完整')
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
