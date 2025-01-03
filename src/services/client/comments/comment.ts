import {getVisitorId} from "@/services/client/comments/fingerprint";
import {PSCommentModel} from "@/atom/common/models/comment";
import {PLInsertResult, PLSelectResult} from "@/atom/common/models/protocol";

export async function makePost<T>(url: string, params: unknown): Promise<T> {
    const response = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    return response.json()
}

export async function makeGet<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        credentials: 'include',
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
    return response.json()
}

export async function submitComment(submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = getBackendUrl() + '/comments'
    return await makePost(url, submitRequest) as PLInsertResult<PSCommentModel>
}

export async function fetchComments({resource}: { resource: string }) {
    const fingerprint = await getVisitorId()
    const url = getBackendUrl() + '/comments?resource=' + resource + '&fingerprint=' + fingerprint
    return await makeGet<PLSelectResult<PSCommentModel>>(url)
}

function getBackendUrl() {
    return 'http://127.0.0.1:8001'
}
