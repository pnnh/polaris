import {Request, Response} from "express";
import {SystemArticleService} from "@/worker/services/article";
import {mustGetFirstDir} from "@/services/server/config";
import {CodeOk} from "@/models/common/protocol";


export async function selectList(request: Request, response: Response, {params}: {
    params: {
        channel: string,
        article: string,
    }
}) {
    const domainUrl = mustGetFirstDir()
    const articleService = new SystemArticleService(domainUrl)

    const {channel, article} = params;
    const parentPath = request.get('parentPath') as string
    const result = await articleService.selectFiles(channel, article, parentPath)
    const body = {
        code: CodeOk,
        data: result
    }
    return response.json(body)
}



export async function getOneBytes(request: Request, response: Response, {params}: {
    params: { channel: string, article: string, path: string[] }
}) {
    const domainUrl = mustGetFirstDir()
    const articleService = new SystemArticleService(domainUrl)
    const {channel, article, path} = params
    const result = articleService.readAssets(String(channel), article as string, (path as string[]).join('/'))

    if (!result) {
        return response.json({status: 404})
    }
    // todo: 返回一个文件流
    //return response.json(result.buffer, {headers: {'Content-Type': result.mime}});
}
