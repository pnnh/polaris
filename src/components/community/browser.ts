'use client'

import {CodeOk, PLDeleteResult, PLInsertResult, PLUpdateResult} from "@pnnh/atom";
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

    static async clientConsoleInsertImage(stargateUrl: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/console/community/images`
        const insertResult = await clientMakePost<PLInsertResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('图集插入失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleUpdateImage(stargateUrl: string, uid: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/console/community/images/${uid}`
        const insertResult = await clientMakePut<PLUpdateResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('图集更新失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleDeleteImage(stargateUrl: string, uid: string): Promise<boolean> {
        const url = `${stargateUrl}/console/community/images/${uid}`
        const deleteResult = await clientMakePost<PLDeleteResult>(url, {});
        if (!deleteResult || deleteResult.code !== CodeOk) {
            console.warn('图集删除失败', deleteResult);
            return false;
        }
        return true;
    }

    static async clientConsoleInsertFile(stargateUrl: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/console/community/files`
        const insertResult = await clientMakePost<PLInsertResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文件插入失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleUpdateFile(stargateUrl: string, uid: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/console/community/files/${uid}`
        const insertResult = await clientMakePut<PLUpdateResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文件更新失败', insertResult);
            return '';
        }
        return insertResult.data
    }
}
