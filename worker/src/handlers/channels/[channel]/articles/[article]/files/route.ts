import {Request, Response} from "express";
import {serverConfig} from "@/services/server/config";
import {SystemArticleService} from "@/business/server/content/article";
import {CodeOk} from "@/business/common/models/common-result";

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
