import {CodeOk, PLInsertResult} from "@pnnh/atom";
import {serverMakePost} from "@pnnh/atom/nodejs";
import {cookies, headers} from "next/headers";
import {serverLogDebugMeta, serverLogWarnMeta} from "@/components/server/logger";

export async function serverInsertArticleViewer(portalUrl: string, articleUid: string, clientIp: string): Promise<void> {
    if (!clientIp) {
        return undefined
    }

    const url = `${portalUrl}/articles/${articleUid}/viewer`
    const headerList = await headers();
    const headersString = Array.from(headerList.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    serverLogDebugMeta('serverInsertArticleViewer', {headersString});

    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const postParams = {
        clientIp,
        headers: headersString
    }
    const insertResult = await serverMakePost<PLInsertResult>(url, postParams, authHeader);
    if (!insertResult || insertResult.code !== CodeOk || !insertResult.data) {
        serverLogWarnMeta('serverInsertArticleViewer', {insertResult});
        return undefined
    }
    const modelInfo = insertResult.data
    if (!modelInfo) {
        console.warn('invalid channel information')
        return undefined
    }
}
