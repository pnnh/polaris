import {CodeOk, CommonResult, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSToolModel} from "@/components/common/models/tool";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";

export class ManagementToolService {
    static async queryTools(
        stargateUrl: string,
        queryParams: Record<string, unknown>
    ): Promise<PLSelectData<PSToolModel>> {
        const rawQuery = queryString.stringify(queryParams)
        const url = `${stargateUrl}/management/tools?${rawQuery}`
        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()
        const getResult = await serverMakeGet<PLSelectResult<PSToolModel>>(url, authHeader);
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            throw new Error('获取工具列表失败');
        }
        const selectData = getResult.data
        if (!selectData || !selectData.range) {
            throw new Error('获取工具列表失败');
        }
        return selectData;
    }

    static async getTool(
        stargateUrl: string,
        uid: string
    ): Promise<PSToolModel | undefined> {
        if (!uid) return undefined
        const url = `${stargateUrl}/management/tools/${uid}`
        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()
        const getResult = await serverMakeGet<CommonResult<PSToolModel | undefined>>(url, authHeader);
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            return undefined
        }
        const modelInfo = getResult.data
        if (!modelInfo || !modelInfo.uid) {
            console.warn('invalid tool information')
            return undefined
        }
        return getResult.data;
    }
}
