import {CodeOk, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSImageModel} from "@/components/common/models/image";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";

export class ManagementImageService {
    static async queryImages(
        stargateUrl: string,
        queryParams: Record<string, unknown>
    ): Promise<PLSelectData<PSImageModel>> {
        const rawQuery = queryString.stringify(queryParams)
        const url = `${stargateUrl}/management/images?${rawQuery}`
        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()
        const getResult = await serverMakeGet<PLSelectResult<PSImageModel>>(url, authHeader);
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            throw new Error('获取图片列表失败');
        }
        const selectData = getResult.data
        if (!selectData || !selectData.range) {
            throw new Error('获取图片列表失败');
        }
        return selectData;
    }
}
