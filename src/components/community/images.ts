import {CodeOk, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSImageModel} from "@/components/common/models/image";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";
import {transKey} from "@/components/common/locales/normal";

export class CommunityImageNodeService {
    static async consoleQueryImages(stargateUrl: string, lang: string, queryParams: Record<string, any>): Promise<PLSelectData<PSImageModel>> {
        const rawQuery = queryString.stringify(queryParams)
        const url = `${stargateUrl}/community/images?${rawQuery}`
        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()
        const getResult = await serverMakeGet<PLSelectResult<PSImageModel>>(url, authHeader);
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            throw new Error(transKey(lang, 'photos.getListFailed'));
        }
        const selectData = getResult.data
        if (!selectData || !selectData.range) {
            throw new Error(transKey(lang, 'photos.getListFailed'));
        }
        return selectData;
    }
}
