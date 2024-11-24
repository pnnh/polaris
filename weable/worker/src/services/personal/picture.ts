import {PLSelectResult, NPPictureModel} from "@pnnh/venus-business";
import fs from "node:fs";
import frontMatter from "front-matter";
import {decodeBase64String, encodeBase64String, getType} from "@pnnh/atom";
import path from "path";
import {emptySelectResult} from "@pnnh/venus-business";
import {serverConfig} from "@/services/server/config";
import {isImage} from "@/utils/image";

export class NPPictureService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = systemDomain.replace('file://', '')
    }

    async #findIndexPictureFile(imagePackagePath: string) {
        const files = fs.readdirSync(imagePackagePath)
        for (const file of files) {
            const stat = fs.statSync(path.join(imagePackagePath, file))
            if (stat.isFile() && isImage(file)) {
                return file
            }
        }
    }

    // 从.image形式的图片包目录中解析图片信息
    async #parsePictureFromPackage(resourceDirectory: string, resourceUrl: string, fileName: string): Promise<NPPictureModel | undefined> {
        const imagePackagePath = path.join(resourceDirectory, fileName)
        const pictureName = path.basename(fileName, path.extname(fileName))
        const pictureUniqueName = encodeBase64String(fileName)
        const imageFileName = await this.#findIndexPictureFile(imagePackagePath)
        if (!imageFileName) {
            return undefined
        }
        const imageFileUrn = encodeBase64String(imageFileName)
        const fileUrl = `${resourceUrl}/pictures/${pictureUniqueName}/assets/${imageFileUrn}`
        const model: NPPictureModel = {
            file: fileUrl,
            folder: "", nid: 0, status: 0,
            title: pictureName,
            create_time: "", update_time: "",
            uid: pictureUniqueName,
            description: '',
            owner: '',
            urn: pictureUniqueName
        }
        const metadataFile = path.join(imagePackagePath, 'index.md')
        if (fs.existsSync(metadataFile)) {
            const metadataText = fs.readFileSync(metadataFile, 'utf-8')
            const matter = frontMatter(metadataText)
            const metadata = matter.attributes as
                { image: string, description: string, title: string }
            if (metadata) {
                if (metadata.description) {
                    model.description = metadata.description
                }
            }
        }
        return model
    }

    // 从图片文件中解析图片信息
    async #parsePictureFromFile(resourcePath: string, resourceUrl: string, fileName: string): Promise<NPPictureModel | undefined> {
        const pictureName = path.basename(fileName, path.extname(fileName))
        const pictureUrn = encodeBase64String(fileName)
        const imageFileUrn = encodeBase64String(fileName)
        const fileUrl = `${resourceUrl}/pictures/${pictureUrn}/assets/${imageFileUrn}`
        const model: NPPictureModel = {
            file: fileUrl,
            folder: "", nid: 0, status: 0,
            title: pictureName,
            create_time: "", update_time: "",
            uid: pictureUrn,
            description: '',
            owner: '',
            urn: pictureUrn
        }
        return model
    }

    // 检索某一个目录下的图片信息，并返回数组
    async #parsePictureList(resourceDirectory: string, resourceUrl: string): Promise<NPPictureModel[]> {
        const list: NPPictureModel[] = []
        const files = fs.readdirSync(resourceDirectory)
        for (const file of files) {
            const imagePackagePath = path.join(resourceDirectory, file)
            const stat = fs.statSync(imagePackagePath)
            if (stat.isDirectory() && file.endsWith('.image')) {
                const model = await this.#parsePictureFromPackage(resourceDirectory, resourceUrl, file)
                if (model) list.push(model)
            } else if (stat.isFile() && isImage(file)) {
                const model = await this.#parsePictureFromFile(resourceDirectory, resourceUrl, file)
                if (model) list.push(model)
            }
        }
        return list
    }

    async selectPictures(libraryUrn: string, albumUrn: string): Promise<PLSelectResult<NPPictureModel>> {
        const basePath = this.systemDomain

        const libraryFileName = decodeBase64String(libraryUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName))) {
            return emptySelectResult()
        }
        const albumFileName = decodeBase64String(albumUrn)
        if (!fs.existsSync(path.join(basePath, libraryFileName, albumFileName))) {
            return emptySelectResult()
        }
        const resourceDirectory = path.join(basePath, libraryFileName, albumFileName)
        const resourceUrl = `${serverConfig.SELF_URL}/personal/libraries/${libraryUrn}/albums/${albumUrn}`
        const notes = await this.#parsePictureList(resourceDirectory, resourceUrl)

        return {
            range: notes,
            count: notes.length,
            page: 1,
            size: notes.length
        }
    }

    async readAssets(libraryUrn: string, albumUrn: string, pictureUrn: string, assetsUrn: string) {
        const libraryPath = decodeBase64String(libraryUrn)
        const albumPath = decodeBase64String(albumUrn)
        const picturePath = decodeBase64String(pictureUrn)
        const assetsPath = decodeBase64String(assetsUrn)
        let fullPath = path.join(this.systemDomain, libraryPath, albumPath, picturePath)
        // 如果不是图片文件，那么就是图片包目录
        if (!isImage(picturePath)) {
            fullPath = path.join(fullPath, assetsPath)
        }

        const stat = fs.statSync(fullPath)
        if (stat && stat.isFile() && stat.size < 4096000) {
            const mimeType = getType(fullPath)
            return {
                mime: mimeType,
                buffer: fs.readFileSync(fullPath)
            }
        }
        return undefined
    }
}
