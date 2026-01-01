'use client'

import {CodeOk, PLUpdateResult} from "@pnnh/atom";
import {clientMakePost} from "@pnnh/atom/browser";

export class CommunityBrowser {
    static async clientConsoleUpdateArticle(portalUrl: string, uid: string, model: unknown): Promise<string> {
        const url = `${portalUrl}/console/community/articles/${uid}`
        const insertResult = await clientMakePost<PLUpdateResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文章更新失败', insertResult);
            return '';
        }
        return insertResult.data
    }
}
