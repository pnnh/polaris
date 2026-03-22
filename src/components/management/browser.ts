'use client'

import {CodeOk, CommonResult} from "@pnnh/atom";
import {clientMakePost} from "@pnnh/atom/browser";

export class ManagementBrowser {
    /**
     * Batch approve (or reset) articles via the management API.
     * Calls POST /stargate/management/articles/approve
     * @param stargateUrl  Public stargate URL
     * @param uids         List of article UIDs to update
     * @param status       1 = approved, 0 = reset to pending
     * @returns { success: number, fail: number }
     */
    static async clientApproveArticles(
        stargateUrl: string,
        uids: string[],
        status: number = 1
    ): Promise<{ success: number; fail: number }> {
        const url = `${stargateUrl}/management/articles/approve`;
        const result = await clientMakePost<CommonResult<string>>(url, {uids, status});
        if (!result || result.code !== CodeOk) {
            console.warn('批量审核失败', result);
            return {success: 0, fail: uids.length};
        }
        const successCount = parseInt(result.data || '0', 10);
        return {success: successCount, fail: uids.length - successCount};
    }
}
