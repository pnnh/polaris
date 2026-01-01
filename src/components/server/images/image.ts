import {CodeOk, CommonResult, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";
import {PSImageModel} from "@/components/common/models/image";
import {transText} from "@/components/common/locales/normal";

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
    return getResult.data;
}

export async function serverSelectImages(poseidonUrl: string, lang: string, queryParams: Record<string, any>): Promise<PLSelectData<PSImageModel>> {
    const rawQuery = queryString.stringify(queryParams)
    const url = `${poseidonUrl}/images?${rawQuery}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<PLSelectResult<PSImageModel>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        throw new Error(transText(lang, '获取文章列表失败', 'Failed to get image list'));
    }
    const selectData = getResult.data
    if (!selectData || !selectData.range) {
        throw new Error(transText(lang, '获取文章列表失败', 'Failed to get image list'));
    }
    return selectData;
}
