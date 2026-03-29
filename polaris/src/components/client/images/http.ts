'use client'

import queryString from "query-string";
import {CodeOk, PLSelectResult} from "@pnnh/atom";
import {clientMakeGet} from "@pnnh/atom/browser";
import {PSFileModel} from "@/components/common/models/file";


export async function clientConsoleSelectImages(portalUrl: string, selectQuery: Record<string, any>) {
    const rawQuery = queryString.stringify(selectQuery)
    const url = `${portalUrl}/console/personal/images?${rawQuery}`
    const selectResult = await clientMakeGet<PLSelectResult<PSFileModel>>(url)

    if (!selectResult || selectResult.code !== CodeOk || !selectResult.data) {
        console.debug('获取图片列表失败', selectResult);
        return undefined;
    }
    return selectResult.data
}
