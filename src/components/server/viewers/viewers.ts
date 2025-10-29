import {CodeOk, CommonResult, PLInsertResult, PLSelectData, PLSelectResult} from "@/atom/common/models/protocol";
import {serverMakeGet, serverMakePost} from "@/atom/server/http";
import {headers, cookies} from "next/headers";
import {logDebugMeta, logDebugValues, logErrorMeta, logErrorValues, logWarnValues,} from "@/components/server/logger";

export async function serverInsertArticleViewer(portalUrl: string, articleUid: string, clientIp: string): Promise<void> {
    if (!clientIp) {
        return undefined
    }

    const url = `${portalUrl}/articles/${articleUid}/viewer`
    const headerList = await headers();
    const headersString = Array.from(headerList.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    logDebugValues('serverInsertArticleViewer', headersString);

    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const postParams = {
        clientIp,
        headers: headersString
    }
    const insertResult = await serverMakePost<PLInsertResult>(url, postParams, authHeader);
    if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
        logWarnValues('serverInsertArticleViewer', 'insertResult is invalid', insertResult);
        return undefined
    }
    const modelInfo = insertResult.data
    if (!modelInfo) {
        console.warn('invalid channel information')
        return undefined
    }
}
