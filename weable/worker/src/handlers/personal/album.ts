import {serverConfig} from "@/services/server/config";
import {Request, Response} from "express";
import {NPAlbumService} from "@/services/personal/album";

// 查询频道列表
export async function personalSelectAlbums(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const {library} = request.params
    const service = new NPAlbumService(domainUrl)

    const result = await service.selectNotebooks(library)
    return response.json(result)
}
