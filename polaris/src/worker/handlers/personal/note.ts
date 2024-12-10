
import {Request, Response} from "express";
import {mustGetFirstDir} from "@/services/server/config";
import {SystemNoteService} from "@/worker/services/note";
import {SPNoteModel} from "@/models/common/personal/note";

// 查询频道列表
export async function selectNotes(request: Request, response: Response) {
    const domainUrl = mustGetFirstDir()

    const {library, notebook} = request.params
    const service = new SystemNoteService(domainUrl)

    const result = await service.selectNotes(library, notebook)
    return response.json(result)
}

export async function updateNote(request: Request, response: Response) {
    const domainUrl = mustGetFirstDir()

    const {library, notebook, note} = request.params
    const service = new SystemNoteService(domainUrl)

    const article = request.body as SPNoteModel
    console.log('updateNote', article)

    const result = await service.updateNote(library, notebook, note, article)
    return response.json(result)
}
