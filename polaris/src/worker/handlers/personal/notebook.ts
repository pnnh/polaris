
import {Request, Response} from "express";
import {SystemNotebookService} from "@/worker/services/notebook";
import {mustGetFirstDir} from "@/services/server/config";

// 查询频道列表
export async function selectNotebooks(request: Request, response: Response) {
    const domainUrl = mustGetFirstDir()

    const {library} = request.params
    const service = new SystemNotebookService(domainUrl)

    const result = await service.selectNotebooks(library)
    return response.json(result)
}
