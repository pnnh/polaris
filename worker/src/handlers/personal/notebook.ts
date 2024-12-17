import {serverConfig} from "@/services/server/config";
import {Request, Response} from "express";
import {SystemNotebookService} from "@pnnh/polaris-business";

// 查询频道列表
export async function selectNotebooks(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const {library} = request.params
    const service = new SystemNotebookService(domainUrl)

    const result = await service.selectNotebooks(library)
    return response.json(result)
}
