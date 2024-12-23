import fs from "node:fs";
import frontMatter from "front-matter";
import path from "path";
import {emptySelectResult, PLSelectResult} from "@/common/models/common-result";
import {CodeOk} from "@/common/models/common-result";
import {PSFileModel} from "@/common/models/file";
import {encodeMD5} from "@/common/crypto";
import * as process from "node:process";

export function resolveUrl(url: string) {
    if (url.startsWith('file://~')) {
        return url.replace('file://~', process.env.HOME || '')
    } else if (url.startsWith('file://')) {
        return url.replace('file://', '')
    }
    return url
}

export interface ISelectFilesOptions {
    directory: boolean
}

export class SystemFileService {
    async selectFiles(dirUrl: string, options: ISelectFilesOptions | undefined): Promise<PLSelectResult<PSFileModel>> {
        const dirPath = resolveUrl(dirUrl)
        const fileList: PSFileModel[] = []
        if (!fs.existsSync(dirPath)) {
            return emptySelectResult()
        }
        const files = fs.readdirSync(dirPath)
        for (const file of files) {
            const stat = fs.statSync(path.join(dirPath, file))
            if (options && options.directory) {
                if (!stat.isDirectory()) {
                    continue
                }
            }
            const fileName = path.basename(file, path.extname(file))
            const fileUniqueName = encodeMD5(file)
            const model: PSFileModel = {
                Name: fileName,
                CreateTime: "", UpdateTime: "",
                URN: fileUniqueName,
                Description: '',
                IsDir: stat.isDirectory(),
                IsHidden: false,
                IsIgnore: false,
                Keywords: '',
                Title: fileName,
                Size: 0,
                Url: dirUrl + '/' + file,
                Path: path.join(dirPath, file),
            }
            const metadataFile = path.join(dirPath, '/', file, 'metadata.md')
            if (fs.existsSync(metadataFile)) {
                const metadataText = fs.readFileSync(metadataFile, 'utf-8')
                const metadata = frontMatter(metadataText).attributes as
                    { image: string, description: string, title: string }
                if (metadata) {
                    if (metadata.description) {
                        model.Description = metadata.description
                    }
                    if (metadata.title) {
                        model.Name = metadata.title
                    }
                }
            }
            fileList.push(model)
        }
        return {
            code: CodeOk,
            message: '',
            data: {
                range: fileList,
                count: fileList.length,
                page: 1,
                size: fileList.length
            }
        }
    }
}
