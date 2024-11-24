import fs from "node:fs";
import frontMatter from "front-matter";
import path from "path";
import {bulkInsertOrUpdateArticles, openMainDatabase} from "@/services/server/database";
import {createPaginationByPage} from "@pnnh/atom";
import {NPPictureModel, PLSelectResult} from "@pnnh/venus-business";
import ignore from 'ignore'
import {decodeBase64String, encodeBase64String, getType} from "@pnnh/atom";

const assetsIgnore = ignore().add(['.*', 'node_modules', 'dist', 'build', 'out', 'target', 'logs', 'logs/*', 'logs/**/*'])

export class SystemPictureService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = systemDomain.replace('file://', '')
    }

    async #parseImageInfo(channelUrn: string, articlePath: string) {
        const extName = path.extname(articlePath)
        const noteName = path.basename(articlePath, extName)
        const pictureUrn = encodeBase64String(noteName)

        const model: NPPictureModel = {
            file: "", folder: "", nid: 0, status: 0,
            create_time: "",
            update_time: "",
            uid: pictureUrn,
            description: '',
            urn: pictureUrn,
            title: noteName,
            owner: ''
        }

        let metaFilePath
        if (extName === '.image') {
            metaFilePath = path.join(articlePath, 'index.md')
        } else if (extName === '.md') {
            metaFilePath = articlePath
        } else {
            throw new Error('不支持的文件类型')
        }
        if (!fs.existsSync(metaFilePath)) {
            return model
        }
        const statIndex = fs.statSync(metaFilePath)
        if (statIndex.isFile()) {
            model.create_time = statIndex.birthtime.toISOString()
            model.update_time = statIndex.mtime.toISOString()
            const metadataText = fs.readFileSync(metaFilePath, 'utf-8')
            const matter = frontMatter(metadataText)
            const metadata = matter.attributes as
                { image: string, description: string, title: string }
            if (metadata) {
                if (metadata.description) {
                    model.description = metadata.description
                }
                if (metadata.title) {
                    model.title = metadata.title
                }
            }
        }
        return model
    }

    async #scanImagesInChannel(channelPath: string) {
        const images: NPPictureModel[] = []
        const channelName = path.basename(channelPath, path.extname(channelPath))
        const channelUrn = encodeBase64String(channelName)
        const files = fs.readdirSync(channelPath)
        for (const file of files) {
            const fullPath = path.join(channelPath, file)
            const stat = fs.statSync(fullPath)
            const extName = path.extname(file)
            if ((stat.isDirectory() && extName === '.image')) {
                const model = await this.#parseImageInfo(channelUrn, fullPath)
                images.push(model)
            }
        }
        return images
    }

    async #scanImages() {
        const images: NPPictureModel[] = []
        const files = fs.readdirSync(this.systemDomain)
        for (const file of files) {
            const extName = path.extname(file)
            const channelPath = path.join(this.systemDomain, file)
            const stat = fs.statSync(channelPath)
            if (stat.isDirectory() && extName === '.chan') {
                const channelArticles = await this.#scanImagesInChannel(channelPath)
                images.push(...channelArticles)
            }
        }
        return images
    }

    async selectImagesFromDatabase(page: number, size: number): Promise<PLSelectResult<NPPictureModel>> {
        const db = await openMainDatabase()
        const {limit, offset} = createPaginationByPage(page, size)
        const result = await db.all<NPPictureModel[]>(
            `SELECT * FROM images ORDER BY update_time DESC LIMIT :limit OFFSET :offset`, {
                ':limit': limit,
                ':offset': offset
            })
        const count = await db.get<{ total: number }>('SELECT COUNT(*) AS total FROM images')
        if (!count) {
            throw new Error('查询count失败')
        }
        return {
            range: result,
            count: count.total,
            page: page,
            size: result.length
        }
    }

    async selectArticlesInChannel(channelUrn: string) {

        ///const channelPath = path.join(this.systemDomain, `${channelUrn}.chan`)
        const channelPath = decodeBase64String(channelUrn)
        const fullPath = path.join(this.systemDomain, channelPath)
        const images: NPPictureModel[] = await this.#scanImagesInChannel(fullPath)
        return {
            range: images,
            count: images.length,
            page: 1,
            size: images.length
        }
    }

    // 由定时任务调用
    async runtimeSyncArticles() {
        const images: NPPictureModel[] = await this.#scanImages()
        await bulkInsertOrUpdateArticles(images)
    }

    async selectImages() {
        const images: NPPictureModel[] = await this.#scanImages()
        return {
            range: images,
            count: images.length,
            page: 1,
            size: images.length
        }
    }

    async getImage(channelName: string, articleName: string) {
        const channelPath = `${channelName}.chan`
        const channelUrn = encodeBase64String(channelPath)
        let fullPath = path.join(this.systemDomain, channelPath, `${articleName}.note`)

        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
            return await this.#parseImageInfo(channelUrn, fullPath)
        }
        fullPath = path.join(this.systemDomain, channelPath, `${articleName}.md`)
        if (fs.existsSync(fullPath)) {
            return await this.#parseImageInfo(channelUrn, fullPath)
        }
        return undefined
    }

    readAssets(channelUrn: string, pictureUrn: string, filePath: string) {
        if (!filePath.startsWith('assets/')) {
            throw new Error('只允许读取assets文件')
        }
        const channelPath = `${channelUrn}.chan`
        const articlePath = `${pictureUrn}.note`
        const fullPath = path.join(this.systemDomain, channelPath, articlePath, filePath)

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
