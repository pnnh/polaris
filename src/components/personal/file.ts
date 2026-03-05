import {CodeOk, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import queryString from "query-string";
import {cookies} from "next/headers";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {transKey} from "@/components/common/locales/normal";
import {PSFileModel} from "../common/models/file";

export async function serverConsoleSelectFiles(lang: string, queryParams: Record<string, any>): Promise<PLSelectData<PSFileModel>> {
    const serverConfig = await useServerConfig()
    const stargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const rawQuery = queryString.stringify(queryParams)
    const url = `${stargateUrl}/console/files?${rawQuery}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<PLSelectResult<PSFileModel>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        throw new Error(transKey(lang, 'files.getListFailed'));
    }
    const selectData = getResult.data
    if (!selectData || !selectData.range) {
        throw new Error(transKey(lang, 'files.getListFailed'));
    }
    return selectData;
}
