'use client'

import {CodeOk, CommonResult, PLUpdateResult} from "@/atom/common/models/protocol";
import {clientMakePost, clientMakePut} from "@/atom/client/http";

export async function clientInsertArticle(portalUrl: string, model: unknown): Promise<string> {
    const url = `${portalUrl}/articles`
    const insertResult = await clientMakePost<PLUpdateResult>(url, model);
    if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
        console.warn('文章插入失败', insertResult);
        return '';
    }
    return insertResult.data
}

export async function clientUpdateArticle(portalUrl: string, uid: string, model: unknown): Promise<string> {
    const url = `${portalUrl}/articles/${uid}`
    const insertResult = await clientMakePut<PLUpdateResult>(url, model);
    if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
        console.warn('文章更新失败', insertResult);
        return '';
    }
    return insertResult.data
}
