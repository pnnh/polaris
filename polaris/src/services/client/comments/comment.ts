import {getVisitorId} from "@/services/client/fingerprint";
import {makeGet, makePost} from "@/services/client/http";
import {LTSelectResult} from "@/models/common_result";
import {CommentModel} from "@/models/comment";

export async function submitComment(email: string | undefined,
                                    nickname: string | undefined, website: string | undefined,
                                    photo: string | undefined,
                                    content: string | undefined,
                                    context: {
                                        env?: string
                                    } = {}) {
    const fingerprint = await getVisitorId()
    const url = getBackendUrl(context.env) + '/comments'
    const postResult = makePost(url, {
        email, nickname, photo, website, fingerprint, content
    })
    return postResult
}

export async function fetchComments(
    context: {
        env?: string
    } = {}) {
    const fingerprint = await getVisitorId()
    const url = getBackendUrl(context.env) + '/comments'
    const postResult = await makeGet<LTSelectResult<CommentModel>>(url)
    return postResult
}

function getBackendUrl(env?: string) {
    if (env === 'development') {
        return 'http://127.0.0.1:8650'
    }
    return 'https://comments.calieo.xyz'
}