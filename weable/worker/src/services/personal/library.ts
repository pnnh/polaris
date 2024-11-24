import {PLSelectResult, NPLibraryModel} from "@pnnh/venus-business";
import fs from "node:fs";
import frontMatter from "front-matter";
import {encodeBase64String} from "@pnnh/atom";
import path from "path";

export class NPLibraryService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = systemDomain.replace('file://', '')
    }

    async selectLibraries(): Promise<PLSelectResult<NPLibraryModel>> {
        const basePath = this.systemDomain
        const librarys: NPLibraryModel[] = []
        const files = fs.readdirSync(basePath)
        for (const file of files) {
            const stat = fs.statSync(path.join(basePath, file))
            if (stat.isDirectory() && file.endsWith('.imagelibrary')) {
                const libraryName = path.basename(file, path.extname(file))
                const uniqueName = encodeBase64String(file)
                const model: NPLibraryModel = {
                    create_time: "", update_time: "",
                    uid: uniqueName,
                    urn: uniqueName,
                    name: libraryName,
                    description: '',
                    nid: 0,
                    owner: ''
                }
                const metadataFile = path.join(basePath, file, 'metadata.md')
                if (fs.existsSync(metadataFile)) {
                    const metadataText = fs.readFileSync(metadataFile, 'utf-8')
                    const metadata = frontMatter(metadataText).attributes as
                        { image: string, description: string, title: string }
                    if (metadata) {
                        if (metadata.description) {
                            model.description = metadata.description
                        }
                        if (metadata.title) {
                            model.name = metadata.title
                        }
                    }
                }
                librarys.push(model)
            }
        }
        return {
            range: librarys,
            count: librarys.length,
            page: 1,
            size: librarys.length
        }
    }
}
