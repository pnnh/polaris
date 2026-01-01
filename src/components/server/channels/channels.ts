import {CodeOk, CommonResult, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSChannelModel} from "@/components/common/models/channel";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";
import {transText} from "@/components/common/locales/normal";

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
        throw new Error(transText(lang, '获取频道列表失败', 'Failed to get channel list'));
    }
    const selectData = getResult.data
    if (!selectData || !selectData.range) {
        throw new Error(transText(lang, '获取频道列表失败', 'Failed to get channel list'));
    }
    return selectData;
}
