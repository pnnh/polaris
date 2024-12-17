import {Request, Response} from "express";
import {serverConfig} from "@/services/server/config";
import {SystemArticleService} from "@pnnh/polaris-business";

export async function GET(request: Request, response: Response, {params}: {
    params: { channel: string, article: string, path: string[] }
}) {
    const domainUrl = serverConfig.INITIAL_DOMAINS
    const articleService = new SystemArticleService(domainUrl)
    const {channel, article, path} = params
    const result = articleService.readAssets(String(channel), article as string, (path as string[]).join('/'))

    if (!result) {
        return response.json({status: 404})
    }
    // todo: 返回一个文件流
    //return response.json(result.buffer, {headers: {'Content-Type': result.mime}});
}
