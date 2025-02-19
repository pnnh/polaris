import {getVisitorId} from "@/services/client/comments/fingerprint";
import {PSCommentModel} from "@/atom/common/models/comment";
import {PLInsertResult, PLSelectResult} from "@/atom/common/models/protocol";
import {getPortalPublicUrl, makeGet, makePost} from "@/services/client/http";

export async function submitComment(submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = getPortalPublicUrl() + '/comments'
    return await makePost(url, submitRequest) as PLInsertResult<PSCommentModel>
}

export async function fetchComments({resource}: { resource: string }) {
    const fingerprint = await getVisitorId()
    const url = getPortalPublicUrl() + '/comments?resource=' + resource + '&fingerprint=' + fingerprint
    return await makeGet<PLSelectResult<PSCommentModel>>(url)
}
