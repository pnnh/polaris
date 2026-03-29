'use client'

import {CodeOk, PLInsertResult, PLUpdateResult} from "@pnnh/atom";
import {clientMakePost, clientMakePut} from "@pnnh/atom/browser";

export class PersonalNotesBrowser {
    /**
     * 创建个人笔记
     */
    static async clientConsoleInsertNote(stargateUrl: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/personal/notes`
        const insertResult = await clientMakePost<PLInsertResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('笔记创建失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    /**
     * 更新个人笔记
     */
    static async clientConsoleUpdateNote(stargateUrl: string, uid: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/personal/notes/${uid}`
        const updateResult = await clientMakePut<PLUpdateResult>(url, model);
        if (!updateResult || updateResult.code !== CodeOk || !updateResult.data) {
            console.warn('笔记更新失败', updateResult);
            return '';
        }
        return updateResult.data
    }
}
