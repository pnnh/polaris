'use client'

import {CodeOk, PLUpdateResult} from "@pnnh/atom";
import {clientMakePost, clientMakePut} from "@pnnh/atom/browser";

export class PersonalBrowser {

    static async clientConsoleInsertArticle(portalUrl: string, model: unknown): Promise<string> {
        const url = `${portalUrl}/console/articles`
        const insertResult = await clientMakePost<PLUpdateResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文章插入失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleUpdateArticle(portalUrl: string, uid: string, model: unknown): Promise<string> {
        const url = `${portalUrl}/console/articles/${uid}`
        const insertResult = await clientMakePut<PLUpdateResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文章更新失败', insertResult);
            return '';
        }
        return insertResult.data
    }
}
