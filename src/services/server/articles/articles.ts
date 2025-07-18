import {CodeOk, CommonResult} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/photon/common/models/article";
import {serverMakeGet} from "@/atom/server/http";
import {cookies} from "next/headers";
import {getDefaultImageUrl} from "@/services/common/note";

export async function serverGetArticle(portalUrl: string, uid: string): Promise<PSArticleModel | undefined> {
    if (!uid) {
        return undefined
    }
    const url = `${portalUrl}/articles/${uid}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<CommonResult<PSArticleModel | undefined>>(url, authHeader);
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return undefined
    }
    const modelInfo = getResult.data
    if (!modelInfo || !modelInfo.uid) {
        console.warn('用户信息不完整')
        return undefined
    }
    if (modelInfo.cover) {
        modelInfo.coverUrl = modelInfo.cover.startsWith('http://') || modelInfo.cover.startsWith("https://") ?
            modelInfo.cover : `${portalUrl}/storage${modelInfo.cover}`
    } else {
        modelInfo.coverUrl = getDefaultImageUrl()
    }
    return getResult.data;
}
