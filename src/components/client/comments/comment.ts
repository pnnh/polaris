import {getVisitorId} from "@/components/client/comments/fingerprint";
import {PLInsertResult, PLSelectResult} from "@/atom/common/models/protocol";
import {PSCommentModel} from "@/atom/common/models/comment";
import {clientMakeGet, clientMakePost} from "@/atom/client/http";


export async function submitComment(portalUrl: string, submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = `${portalUrl}/comments`
    return await clientMakePost(url, submitRequest) as PLInsertResult
}

export async function fetchComments({portalUrl, resource}: { portalUrl: string, resource: string }) {
    const fingerprint = await getVisitorId()
    const url = `${portalUrl}/comments?resource=` + resource + '&fingerprint=' + fingerprint
    return await clientMakeGet<PLSelectResult<PSCommentModel>>(url)
}
