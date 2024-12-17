import {serverConfig} from "@/services/server/config";
import {Request, Response} from "express";
import {SystemLibraryService} from "@pnnh/polaris-business";

// 查询频道列表
export async function selectLibraries(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const service = new SystemLibraryService(domainUrl)

    const result = await service.selectLibraries()
    return response.json(result)
}
