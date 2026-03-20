'use client'

import {CodeOk, PLDeleteResult, PLInsertResult, PLUpdateResult} from "@pnnh/atom";
import {clientMakePost, clientMakePut} from "@pnnh/atom/browser";

interface BatchInsertResult {
    code: number;
    message: string;
    data: string; // Number of successfully inserted articles as string
}

export class CommunityBrowser {
    /**
     * Batch insert multiple articles from .md files into the community articles table.
     * Calls POST /stargate/community/articles/batch
     * Returns { success: number, fail: number }
     */
    static async clientConsoleBatchInsertArticles(
        stargateUrl: string,
        models: unknown[]
    ): Promise<{ success: number; fail: number }> {
        const url = `${stargateUrl}/community/articles/batch`;
        const result = await clientMakePost<BatchInsertResult>(url, models);
        if (!result || result.code !== CodeOk) {
            console.warn('批量文章插入失败', result);
            return {success: 0, fail: models.length};
        }
        const successCount = parseInt(result.data || '0', 10);
        return {success: successCount, fail: models.length - successCount};
    }

    static async clientConsoleInsertArticle(stargateUrl: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/community/articles`
        const insertResult = await clientMakePost<PLInsertResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文章插入失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleUpdateArticle(stargateUrl: string, uid: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/community/articles/${uid}`
        const insertResult = await clientMakePut<PLUpdateResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文章更新失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleInsertImage(stargateUrl: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/community/images`
        const insertResult = await clientMakePost<PLInsertResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('图集插入失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleUpdateImage(stargateUrl: string, uid: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/community/images/${uid}`
        const insertResult = await clientMakePut<PLUpdateResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('图集更新失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleDeleteImage(stargateUrl: string, uid: string): Promise<boolean> {
        const url = `${stargateUrl}/community/images/${uid}`
        const deleteResult = await clientMakePost<PLDeleteResult>(url, {});
        if (!deleteResult || deleteResult.code !== CodeOk) {
            console.warn('图集删除失败', deleteResult);
            return false;
        }
        return true;
    }

    static async clientConsoleInsertFile(stargateUrl: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/community/files`
        const insertResult = await clientMakePost<PLInsertResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文件插入失败', insertResult);
            return '';
        }
        return insertResult.data
    }

    static async clientConsoleUpdateFile(stargateUrl: string, uid: string, model: unknown): Promise<string> {
        const url = `${stargateUrl}/community/files/${uid}`
        const insertResult = await clientMakePut<PLUpdateResult>(url, model);
        if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
            console.warn('文件更新失败', insertResult);
            return '';
        }
        return insertResult.data
    }
}
