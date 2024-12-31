import {getVisitorId} from "@/services/client/comments/fingerprint";
import {PSCommentModel} from "@/atom/common/models/comment";
import {PLSelectResult} from "@/atom/common/models/protocol";

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

export async function submitComment(email: string | undefined,
                                    nickname: string | undefined, website: string | undefined,
                                    photo: string | undefined,
                                    content: string | undefined,) {
    const fingerprint = await getVisitorId()
    const url = getBackendUrl() + '/comments'
    const postResult = makePost(url, {
        email, nickname, photo, website, fingerprint, content
    })
    return postResult
}

export async function fetchComments() {
    const fingerprint = await getVisitorId()
    const url = getBackendUrl() + '/comments'
    const postResult = await makeGet<PLSelectResult<PSCommentModel>>(url)
    return postResult
}

function getBackendUrl() {
    return 'http://127.0.0.1:8001'
}
