'use client'

import {CodeOk, PLInsertResult, PLUpdateResult} from "@pnnh/atom";
import {clientMakePost, clientMakePut} from "@pnnh/atom/browser";

export class CommunityBrowser {
    static async clientConsoleInsertArticle(stargateUrl: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/console/community/articles`
        const insertResult = await clientMakePost<PLInsertResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文章插入失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleUpdateArticle(stargateUrl: string, uid: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/console/community/articles/${uid}`
        const insertResult = await clientMakePut<PLUpdateResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文章更新失败', insertResult);
            return '';
        }
        return insertResult.data
    }
}
