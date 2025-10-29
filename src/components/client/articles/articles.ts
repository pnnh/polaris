'use client'

import {CodeOk, CommonResult, PLUpdateResult} from "@/atom/common/models/protocol";
import {clientMakePost, clientMakePut} from "@/atom/client/http";

export async function clientConsoleInsertArticle(portalUrl: string, model: unknown): Promise<string> {
    const url = `${portalUrl}/console/articles`
    const insertResult = await clientMakePost<PLUpdateResult>(url, model);
    if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
        console.warn('文章插入失败', insertResult);
        return '';
    }
    return insertResult.data
}

export async function clientConsoleUpdateArticle(portalUrl: string, uid: string, model: unknown): Promise<string> {
    const url = `${portalUrl}/console/articles/${uid}`
    const insertResult = await clientMakePut<PLUpdateResult>(url, model);
    if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
        console.warn('文章更新失败', insertResult);
        return '';
    }
    return insertResult.data
}
