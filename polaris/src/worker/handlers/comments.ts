import {Request, Response} from "express";
import {PSCommentModel} from "@/models/common/comment";
import {getIpAddress} from "@/utils/express";
import {verifyCache} from "@/worker/cache/cache";
import {CodeFailed, CodeOk, CommonResult, PLInsertResult, PLSelectResult} from "@/models/common/protocol";
import {insertComment, selectComments} from "@/worker/services/comments";


// 查询评论列表
export async function commentsHandler(request: Request, response: Response) {
    const comments = await selectComments()
    const httpResult: PLSelectResult<PSCommentModel> = {
        code: CodeOk, message: 'OK',
        data: {
            count: comments.length, page: 0, range: comments, size: 0
        }
    }
    return response.json(httpResult)
}

// 插入评论
export async function commentInsertHandler(request: Request, response: Response) {
    const {
        nickname, email, website, content, photo, fingerprint,
    } = request.body
    const ipAddress = getIpAddress(request)

    // 内容不可为空
    if (!content || content.length < 1) {
        const exceptionResult: CommonResult<any> = {
            code: CodeFailed,
            message: 'Content is empty',
            data: {}
        }
        return response.status(400).json(exceptionResult)
    }

    // 限制评论频率
    const cacheVerify = verifyCache(fingerprint, ipAddress)
    if (!cacheVerify) {
        const exceptionResult: CommonResult<any> = {
            code: CodeFailed,
            message: 'Verify failed',
            data: {}
        }
        return response.status(400).json(exceptionResult)
    }

    const insertResult = await insertComment(nickname, email, website, photo, fingerprint, content, ipAddress)

    if (!insertResult) {
        const exceptionResult: CommonResult<any> = {
            code: CodeFailed,
            message: 'Insert failed',
            data: {}
        }
        return response.status(400).json(exceptionResult)
    }

    const httpResult: PLInsertResult<any> = {
        code: CodeOk, message: 'OK',
        data: {
            urn: insertResult,
            changes: 1
        }
    }
    return response.json(httpResult)
}
