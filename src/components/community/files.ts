import {CodeOk, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {CmFileModel} from "@/components/common/models/file";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";
import {transKey} from "@/components/common/locales/normal";

export class CommunityFileNodeService {
    static async consoleQueryFiles(stargateUrl: string, lang: string, queryParams: Record<string, any>): Promise<PLSelectData<CmFileModel>> {
        const rawQuery = queryString.stringify(queryParams)
        const url = `${stargateUrl}/console/community/files?${rawQuery}`
        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()
        const getResult = await serverMakeGet<PLSelectResult<CmFileModel>>(url, authHeader);
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            throw new Error(transKey(lang, 'files.getListFailed'));
        }
        const selectData = getResult.data
        if (!selectData || !selectData.range) {
            throw new Error(transKey(lang, 'files.getListFailed'));
        }
        return selectData;
    }
}
