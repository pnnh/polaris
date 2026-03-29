'use client'

import {CodeOk, CommonResult} from "@pnnh/atom";
import {clientMakePost} from "@pnnh/atom/browser";

export class ManagementBrowser {
    static async clientApproveChannels(
        stargateUrl: string,
        uids: string[],
        status: number = 1
    ): Promise<{ success: number; fail: number }> {
        const url = `${stargateUrl}/management/channels/approve`;
        const result = await clientMakePost<CommonResult<string>>(url, {uids, status});
        if (!result || result.code !== CodeOk) {
            console.warn('批量审核频道失败', result);
            return {success: 0, fail: uids.length};
        }
        const successCount = parseInt(result.data || '0', 10);
        return {success: successCount, fail: uids.length - successCount};
    }

    static async clientApproveFiles(
        stargateUrl: string,
        uids: string[],
        status: number = 1
    ): Promise<{ success: number; fail: number }> {
        const url = `${stargateUrl}/management/files/approve`;
        const result = await clientMakePost<CommonResult<string>>(url, {uids, status});
        if (!result || result.code !== CodeOk) {
            console.warn('批量审核文件失败', result);
            return {success: 0, fail: uids.length};
        }
        const successCount = parseInt(result.data || '0', 10);
        return {success: successCount, fail: uids.length - successCount};
    }

}
