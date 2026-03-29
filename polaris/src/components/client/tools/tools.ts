'use client'

import {CodeOk, PLInsertResult, PLUpdateResult} from "@pnnh/atom";
import {clientMakePost, clientMakePut} from "@pnnh/atom/browser";

export async function clientManagementInsertTool(stargateUrl: string, model: unknown): Promise<string> {
    const url = `${stargateUrl}/management/tools`
    const insertResult = await clientMakePost<PLInsertResult>(url, model);
    if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
        console.debug('工具插入失败', insertResult);
        return '';
    }
    return insertResult.data
}

export async function clientManagementUpdateTool(stargateUrl: string, uid: string, model: unknown): Promise<string> {
    const url = `${stargateUrl}/management/tools/${uid}`
    const updateResult = await clientMakePut<PLUpdateResult>(url, model);
    if (!updateResult || updateResult.code !== CodeOk || !updateResult.data) {
        console.warn('工具更新失败', updateResult);
        return '';
    }
    return updateResult.data
}
