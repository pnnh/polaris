import {Request, Response} from "express";
import {CodeFailed, CodeOk, CommonResult, PLInsertResult, PLSelectResult} from "@pnnh/polaris-business";
import {CommentModel} from "@pnnh/polaris-business";
import {verifyCache} from "@/services/server/cache";
import {getIpAddress} from "@/utils/express";
import {insertComment, selectComments} from "@/services/server/postgresql/comments";

// 查询评论列表
export async function commentsHandler(request: Request, response: Response) {
    const comments = await selectComments()
    const httpResult: PLSelectResult<CommentModel> = {
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

    const httpResult: PLInsertResult<CommentModel> = {
        code: CodeOk, message: 'OK',
        data:{
            urn: insertResult, changes: 1
        }
    }
    return response.json(httpResult)
}
