import {Request, Response} from "express";
import {serverConfig} from "@/services/server/config";

export async function selectPictures(request: Request, response: Response, {params}: {
    params: { channel: string, article: string }
}) {
    // const domainUrl = serverConfig.INITIAL_DOMAINS
    // const articleService = new NCPictureService(domainUrl)
    //
    // const {channel, article} = params;
    // const result = await articleService.selectArticlesInChannel(channel as string)
    // return response.json(result)
}


export async function getImage(request: Request, response: Response, {params}: {
    params: { channel: string, article: string }
}) {
    // const domainUrl = serverConfig.INITIAL_DOMAINS
    // const articleService = new SystemPictureService(domainUrl)
    //
    // const {channel, article} = params;
    // const result = await articleService.getImage(channel, article)
    // if (!result) {
    //     return response.json({status: 404})
    // }
    // return response.json(result)
}
