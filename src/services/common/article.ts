
import path from "path";
import fs from "fs";
import frontMatter from "front-matter";
import {SPNoteModel} from "@/models/common/personal/note";
import {PSArticleModel} from "@/models/common/article";
import {encodeBase64String} from "@/utils/basex";

export async function fillNoteMetadata(noteDirectoryFullPath: string, model: SPNoteModel | PSArticleModel) {
    let metadataFile = path.join(noteDirectoryFullPath, 'index.md')
    let metadataText: string | undefined
    if (fs.existsSync(metadataFile)) {
        metadataText = fs.readFileSync(metadataFile, 'utf-8')
    } else {
        metadataFile = path.join(noteDirectoryFullPath, 'README.md')
        if (fs.existsSync(metadataFile)) {
            metadataText = fs.readFileSync(metadataFile, 'utf-8')
        }
    }
    if (!metadataFile || !metadataText) {
        return
    }
    const statIndex = fs.statSync(metadataFile)
    model.create_time = statIndex.birthtime.toISOString()
    model.update_time = statIndex.mtime.toISOString()
    const matter = frontMatter(metadataText)
    model.body = matter.body
    const metadata = matter.attributes as
        { image: string, description: string, title: string, tags: string }
    if (metadata) {
        if (metadata.description) {
            model.description = metadata.description
        }
        if (metadata.title) {
            model.title = metadata.title
        }
        if (metadata.image) {
            model.cover = encodeBase64String(metadata.image)
        }
        if (metadata.tags) {
            model.keywords = metadata.tags
        }
    }
}
