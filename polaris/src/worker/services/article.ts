import fs from "node:fs";
import path from "path";
import {createPaginationByPage} from "@/utils/pagination";
import ignore from 'ignore'
import {fillNoteMetadata} from "@/services/common/article";
import {decodeBase64String, encodeBase64String} from "@/utils/basex";
import {PSArticleFileModel, PSArticleModel} from "@/models/common/article";
import {CodeOk, PLSelectResult} from "@/models/common/protocol";
import {openMainDatabase} from "@/worker/database/database";
import {bulkInsertOrUpdateArticles} from "@/worker/database/article";
import {getType} from "@/utils/mime";

const assetsIgnore = ignore().add(['.*', 'node_modules', 'dist', 'build', 'out', 'target', 'logs', 'logs/*', 'logs/**/*'])

export class SystemArticleService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = systemDomain.replace('file://', '')
    }

    async #parseArticleInfo(channelPath: string, articleFullPath: string) {
        const extName = path.extname(articleFullPath)
        const noteName = path.basename(articleFullPath, extName)
        const channelUrn = encodeBase64String(channelPath)
        const articlePath = noteName + extName
        const articleUrn = encodeBase64String(articlePath)

        const model: PSArticleModel = {
            discover: 0,
            create_time: "", creator: "",
            update_time: "",
            description: '',
            urn: articleUrn,
            title: noteName,
            header: 'markdown',
            body: '',
            keywords: '',
            cover: '',
            owner: '',
            channel: channelUrn,
            partition: '',
            path: ''
        }

        await fillNoteMetadata(articleFullPath, model)
        return model
    }

    async #scanArticlesInChannel(channelFullPath: string, channelPath: string) {
        const articles: PSArticleModel[] = []
        const files = fs.readdirSync(channelFullPath)
        for (const file of files) {
            const fullPath = path.join(channelFullPath, file)
            const stat = fs.statSync(fullPath)
            const extName = path.extname(file)
            if ((stat.isDirectory() && extName === '.note')) {
                const model = await this.#parseArticleInfo(channelPath, fullPath)
                articles.push(model)
            }
        }
        return articles
    }

    async #scanArticles() {
        const articles: PSArticleModel[] = []
        const files = fs.readdirSync(this.systemDomain)
        for (const file of files) {
            const extName = path.extname(file)
            const channelFullPath = path.join(this.systemDomain, file)
            const stat = fs.statSync(channelFullPath)
            if (stat.isDirectory() && (extName === '.chan' || extName === '.channel')) {
                const channelArticles = await this.#scanArticlesInChannel(channelFullPath, file)
                articles.push(...channelArticles)
            }
        }
        return articles
    }

    async selectArticlesFromDatabase(page: number, size: number): Promise<PLSelectResult<PSArticleModel>> {
        const db = await openMainDatabase()
        const {limit, offset} = createPaginationByPage(page, size)
        const result = await db.all<PSArticleModel[]>(
            `SELECT * FROM articles ORDER BY update_time DESC LIMIT :limit OFFSET :offset`, {
                ':limit': limit,
                ':offset': offset
            })
        const count = await db.get<{ total: number }>('SELECT COUNT(*) AS total FROM articles')
        if (!count) {
            throw new Error('查询count失败')
        }
        return {
            code: CodeOk,
            message: '',
            data: {
                range: result,
                count: count.total,
                page: page,
                size: result.length
            }
        }
    }

    async selectArticlesInChannel(channelUrn: string) {
        const channelPath = decodeBase64String(channelUrn)
        const channelFullPath = path.join(this.systemDomain, channelPath)
        const articles: PSArticleModel[] = await this.#scanArticlesInChannel(channelFullPath, channelPath)
        return {
            range: articles,
            count: articles.length,
            page: 1,
            size: articles.length
        }
    }

    // 由定时任务调用
    async runtimeSyncArticles() {
        const articles: PSArticleModel[] = await this.#scanArticles()
        await bulkInsertOrUpdateArticles(articles)
    }

    async selectArticles() {
        const articles: PSArticleModel[] = await this.#scanArticles()
        return {
            range: articles,
            count: articles.length,
            page: 1,
            size: articles.length
        }
    }

    async getArticle(channelUrn: string, articleUrn: string) {
        const channelPath = decodeBase64String(channelUrn)
        const articlePath = decodeBase64String(articleUrn)
        let fullPath = path.join(this.systemDomain, channelPath, articlePath)

        const stat = fs.statSync(fullPath)
        if (stat.isDirectory()) {
            return await this.#parseArticleInfo(channelPath, fullPath)
        }
        fullPath = path.join(this.systemDomain, channelPath, `${articleUrn}.md`)
        if (fs.existsSync(fullPath)) {
            return await this.#parseArticleInfo(channelPath, fullPath)
        }
        return undefined
    }

    async selectFiles(channelUrn: string, articleUrn: string, parentUrn: string): Promise<PLSelectResult<PSArticleFileModel>> {

        const files = this.#scanFiles(channelUrn, articleUrn, parentUrn)
        return {
            code: CodeOk,
            message: '',
            data: {
                range: files,
                count: files.length,
                page: 1,
                size: files.length
            }
        }
    }

    #scanFiles(channelUrn: string, articleUrn: string, parentUrn: string): PSArticleFileModel[] {
        const channelPath = decodeBase64String(channelUrn)
        const articlePath = decodeBase64String(articleUrn)
        const parentPath = parentUrn ? decodeBase64String(parentUrn) : ''

        const parentFullPath = path.join(this.systemDomain, channelPath, articlePath, parentPath)
        if (!fs.existsSync(parentFullPath)) {
            return []
        }
        const files = fs.readdirSync(parentFullPath)
        const resultFiles = files
            .filter(file => !assetsIgnore.ignores(file))
            .map(file => {
                const assetFullPath = path.join(parentFullPath, file)
                const stat = fs.statSync(assetFullPath)
                const assetRelativePath = path.join(parentPath, file)
                const assetUrn = encodeBase64String(assetRelativePath)
                return {
                    name: file,
                    path: path.join(parentPath, file),
                    urn: assetUrn,
                    type: stat.isDirectory() ? 'directory' : 'file',
                } as PSArticleFileModel
            })
        return resultFiles
    }

    readAssets(channelUrn: string, articleUrn: string, assetsUrn: string) {
        const channelPath = decodeBase64String(channelUrn)
        const articlePath = decodeBase64String(articleUrn)
        const assetsPath = decodeBase64String(assetsUrn)
        const fullPath = path.join(this.systemDomain, channelPath, articlePath, assetsPath)

        const stat = fs.statSync(fullPath)
        if (stat && stat.isFile() && stat.size < 4096000) {
            const mimeType = getType(assetsPath)
            return {
                mime: mimeType,
                buffer: fs.readFileSync(fullPath)
            }
        }
        return undefined
    }
}
