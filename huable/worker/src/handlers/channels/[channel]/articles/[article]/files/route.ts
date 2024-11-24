import {Request, Response} from "express";
import {serverConfig} from "@/services/server/config";
import {SystemArticleService} from "@/services/server/domain/system/article";
import {CodeOk} from "@pnnh/polaris-business";

export async function GET(request: Request, response: Response, {params}: {
    params: {
        channel: string,
        article: string,
    }
}) {
    const domainUrl = serverConfig.INITIAL_DOMAINS
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
