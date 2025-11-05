'use client'

import queryString from "query-string";
import {CodeOk, PLInsertResult, PLSelectResult, PLUpdateResult} from "@/atom/common/models/protocol";

import {clientMakeGet} from "@/atom/client/http";

export interface PSImageModel {
    uid: string
    title: string
    create_time: string
    update_time: string
    keywords: string
    description: string
    status: number
    owner: string
    file_path: string
    ext_name: string
    file_url: string
}

export async function clientConsoleSelectImages(portalUrl: string, selectQuery: Record<string, any>) {
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${portalUrl}/console/images?${rawQuery}`
    const selectResult = await clientMakeGet<PLSelectResult<PSImageModel>>(url)

    if (!selectResult || selectResult.code !== CodeOk || !selectResult.data) {
        console.debug('获取图片列表失败', selectResult);
        return undefined;
    }
    return selectResult.data
}
