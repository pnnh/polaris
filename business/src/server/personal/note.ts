
import fs from "node:fs";
import {decodeBase64String, encodeBase64String} from "@pnnh/atom";
import path from "path";
import {SPNoteModel} from "@/common/models/personal/note";
import {CodeOk, emptySelectResult, PLSelectResult} from "@/common/models/common-result";
import {fillNoteMetadata} from "@/common/article";

export class SystemNoteService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = systemDomain.replace('file://', '')
    }

    async selectNotes(libraryUrn: string, notebookUrn: string): Promise<PLSelectResult<SPNoteModel>> {
        const basePath = this.systemDomain
        const notes: SPNoteModel[] = []
        const libraryFileName = decodeBase64String(libraryUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName))) {
            return emptySelectResult()
        }
        const notebookFileName = decodeBase64String(notebookUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName, notebookFileName))) {
            return emptySelectResult()
        }
        const files = fs.readdirSync(path.join(basePath, libraryFileName, notebookFileName))
        for (const file of files) {
            const stat = fs.statSync(path.join(basePath, libraryFileName, notebookFileName, file))
            if (stat.isDirectory() && file.endsWith('.note')) {
                const noteName = path.basename(file, path.extname(file))
                const noteUniqueName = encodeBase64String(file)
                const model: SPNoteModel = {
                    body: "",
                    channel: "",
                    channel_name: "",
                    children: 0,
                    cover: "",
                    discover: 0,
                    header: "markdown",
                    keywords: "",
                    partition: "",
                    path: "",
                    title: noteName,
                    create_time: "", update_time: "",
                    urn: noteUniqueName,
                    name: noteName,
                    description: '',
                    owner: '',
                    library: libraryUrn,
                    notebook: notebookUrn
                }
                let noteDirectoryFullPath = path.join(basePath, libraryFileName, notebookFileName, file)
                await fillNoteMetadata(noteDirectoryFullPath, model)
                notes.push(model)
            }
        }
        return {
            code: CodeOk,
            message: '',
            data: {
                range: notes,
                count: notes.length,
                page: 1,
                size: notes.length
            }
        }
    }


    async updateNote(libraryUrn: string, notebookUrn: string, noteUrn: string,
                     article: SPNoteModel): Promise<void> {
        console.log('执行笔记文件保存操作', article)
        const basePath = this.systemDomain
        const libraryFileName = decodeBase64String(libraryUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName))) {
            return
        }
        const notebookFileName = decodeBase64String(notebookUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName, notebookFileName))) {
            return
        }
        const noteFileName = decodeBase64String(noteUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName, notebookFileName, noteFileName))) {
            return
        }

    }
}
