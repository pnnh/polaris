'use client'

import queryString from "query-string";
import {CodeOk, PLSelectResult} from "@/atom/common/models/protocol";
import {PSChannelModel} from "@/photon/common/models/channel";
import {clientMakeGet} from "@/atom/client/http";

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
