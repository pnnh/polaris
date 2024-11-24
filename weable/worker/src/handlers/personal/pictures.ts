import {Request, Response} from "express";
import {serverConfig} from "@/services/server/config";
import {NPPictureService} from "@/services/personal/picture";

export async function personalFetchPictureFile(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS
    const pictureService = new NPPictureService(domainUrl)
    const {library, album, picture, path} = request.params
    const result = await pictureService.readAssets(String(library), album, picture, path)

    if (!result) {
        return response.json({status: 404})
    }
    response.setHeader('Content-Type', result.mime)
    response.send(result.buffer);
}

// 查询频道列表
export async function personalSelectPictures(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const {library, album} = request.params
    const service = new NPPictureService(domainUrl)

    const result = await service.selectPictures(library, album)
    return response.json(result)
}
