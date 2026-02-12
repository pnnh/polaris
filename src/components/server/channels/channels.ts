import {CodeOk, CommonResult, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSChannelModel} from "@/components/common/models/channel";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";
import {transKey} from "@/components/common/locales/normal";

export async function serverConsoleGetChannel(portalUrl: string, uid: string): Promise<PSChannelModel | undefined> {
    if (!uid) {
        return undefined
    }
    const url = `${portalUrl}/console/channels/${uid}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<CommonResult<PSChannelModel | undefined>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return undefined
    }
    const modelInfo = getResult.data
    if (!modelInfo || !modelInfo.uid) {
        console.warn('invalid channel information')
        return undefined
    }
    return getResult.data;
}

export async function serverConsoleSelectChannels(portalUrl: string, lang: string, queryParams: Record<string, any>): Promise<PLSelectData<PSChannelModel>> {
    const rawQuery = queryString.stringify(queryParams)
    const url = `${portalUrl}/console/channels?${rawQuery}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<PLSelectResult<PSChannelModel>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        throw new Error(transKey(lang, 'channels.getListFailed'));
    }
    const selectData = getResult.data
    if (!selectData || !selectData.range) {
        throw new Error(transKey(lang, 'channels.getListFailed'));
    }
    return selectData;
}
