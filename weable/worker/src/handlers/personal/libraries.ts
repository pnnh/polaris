import {serverConfig} from "@/services/server/config";
import {Request, Response} from "express";
import {NPLibraryService} from "@/services/personal/library";

// 查询频道列表
export async function personalSelectLibraries(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const service = new NPLibraryService(domainUrl)

    const result = await service.selectLibraries()
    return response.json(result)
}
