import {CodeOk, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {CmFileModel, PSFileModel} from "@/components/common/models/file";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";
import {transKey} from "@/components/common/locales/normal";
import {useServerConfig} from "@/components/server/config";
import {clientMakeGet} from "@pnnh/atom/browser";

export class CommunityFileNodeService {
    static async consoleQueryFiles(stargateUrl: string, lang: string, queryParams: Record<string, any>): Promise<PLSelectData<CmFileModel>> {
        const rawQuery = queryString.stringify(queryParams)
        const url = `${stargateUrl}/community/files?${rawQuery}`
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

export interface FileSelectOptions {
    page: number,
    size: number
    parent?: string
    skipDir?: boolean
    channel?: string
}

export async function selectFilePathFromBackend(uid: string): Promise<PLSelectResult<PSFileModel>> {
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL

    let url = `${internalPortalUrl}/cloud/files/path?uid=${encodeURIComponent(uid)}`
    const selectResult = await clientMakeGet<PLSelectResult<PSFileModel>>(url)
    if (!selectResult || selectResult.code !== 200 || !selectResult.data) {
        throw new Error("host notebook")
    }
    return selectResult
}

export async function selectFilesFromBackend(options: FileSelectOptions | undefined = undefined): Promise<PLSelectResult<PSFileModel>> {
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    let url = `${internalPortalUrl}/cloud/files`
    if (options) {
        const query = queryString.stringify(options)
        url = `${url}?${query}`
    }
    const selectResult = await clientMakeGet<PLSelectResult<PSFileModel>>(url)
    if (!selectResult || selectResult.code !== 200 || !selectResult.data) {
        throw new Error("selectFilesFromBackend" + selectResult.code)
    }
    return selectResult
}
