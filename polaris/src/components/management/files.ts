import {CodeOk, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {CMFileModel} from "@/components/common/models/file";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";


export class ManagementFileService {

    static async queryFiles(
        stargateUrl: string,
        queryParams: Record<string, unknown>
    ): Promise<PLSelectData<CMFileModel>> {
        const rawQuery = queryString.stringify(queryParams)
        const url = `${stargateUrl}/management/files?${rawQuery}`
        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()
        const getResult = await serverMakeGet<PLSelectResult<CMFileModel>>(url, authHeader);
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            throw new Error('获取文件列表失败');
        }
        const selectData = getResult.data
        if (!selectData || !selectData.range) {
            throw new Error('获取文件列表失败');
        }
        return selectData;
    }
}
