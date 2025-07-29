'use client'

import queryString from "query-string";
import {CodeOk, PLInsertResult, PLSelectResult, PLUpdateResult} from "@/atom/common/models/protocol";
import {PSChannelModel} from "@/photon/common/models/channel";
import {clientMakeGet} from "@/atom/client/http";
import {clientMakePost, clientMakePut} from "@/atom/client/http";

export async function clientChannelsComplete(portalUrl: string, selectQuery: Record<string, any>) {
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${portalUrl}/channels/complete?${rawQuery}`
    const selectResult = await clientMakeGet<PLSelectResult<PSChannelModel>>(url)

    if (!selectResult || selectResult.code !== CodeOk || !selectResult.data) {
        console.warn('频道自动完成失败', selectResult);
        return undefined;
    }
    return selectResult.data
}

export async function clientConsoleInsertChannel(portalUrl: string, model: unknown): Promise<string> {
    const url = `${portalUrl}/console/channels`
    const insertResult = await clientMakePost<PLInsertResult>(url, model);
    if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
        console.warn('文章插入失败', insertResult);
        return '';
    }
    return insertResult.data
}

export async function clientConsoleUpdateChannel(portalUrl: string, uid: string, model: unknown): Promise<string> {
    const url = `${portalUrl}/console/channels/${uid}`
    const insertResult = await clientMakePut<PLUpdateResult>(url, model);
    if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
        console.warn('文章更新失败', insertResult);
        return '';
    }
    return insertResult.data
}
