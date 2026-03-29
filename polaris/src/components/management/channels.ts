import {CodeOk, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSChannelModel} from "@/components/common/models/channel";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";

export class ManagementChannelService {
    static async queryChannels(
        stargateUrl: string,
        queryParams: Record<string, unknown>
    ): Promise<PLSelectData<PSChannelModel>> {
        const rawQuery = queryString.stringify(queryParams)
        const url = `${stargateUrl}/management/channels?${rawQuery}`
        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()
        const getResult = await serverMakeGet<PLSelectResult<PSChannelModel>>(url, authHeader);
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            throw new Error('获取频道列表失败');
        }
        const selectData = getResult.data
        if (!selectData || !selectData.range) {
            throw new Error('获取频道列表失败');
        }
        return selectData;
    }
}
