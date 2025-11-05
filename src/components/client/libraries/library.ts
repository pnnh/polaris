'use client'

import queryString from "query-string";
import {CodeOk, PLInsertResult, PLSelectResult, PLUpdateResult} from "@/atom/common/models/protocol";

import {clientMakeGet} from "@/atom/client/http";

export interface PSLibraryModel {
    name: string
    title: string
    create_time: string
    update_time: string
    creator: string
    description: string
    image: string
    profile: string
    uid: string
    lang: string
    match: string
    owner: string
    header: string
}

export async function clientConsoleSelectLibraries(portalUrl: string, selectQuery: Record<string, any>) {
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${portalUrl}/console/libraries?${rawQuery}`
    const selectResult = await clientMakeGet<PLSelectResult<PSLibraryModel>>(url)

    if (!selectResult || selectResult.code !== CodeOk || !selectResult.data) {
        console.debug('获取个人库列表失败', selectResult);
        return undefined;
    }
    return selectResult.data
}
