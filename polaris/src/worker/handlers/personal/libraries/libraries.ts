
import {Request, Response} from "express";
import {mustGetFirstDir} from "@/services/server/config";
import {SystemLibraryService} from "@/worker/services/library";

// 查询频道列表
export async function selectLibraries(request: Request, response: Response) {

    const domainUrl = mustGetFirstDir()
    const service = new SystemLibraryService(domainUrl)

    const result = await service.selectLibraries()
    return response.json(result)
}
