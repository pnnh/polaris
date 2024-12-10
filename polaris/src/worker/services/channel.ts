
import fs from "node:fs";
import frontMatter from "front-matter";
import path from "path";
import {decodeBase64String, encodeBase64String, stringToMd5} from "@/utils/basex";
import {PSChannelModel} from "@/models/common/channel";
import {getType} from "@/utils/mime";

export class SystemChannelService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = systemDomain.replace('file://', '')
    }

    async selectChannels() {
        const basePath = this.systemDomain
        const channels: PSChannelModel[] = []
        const files = fs.readdirSync(basePath)
        for (const file of files) {
            const stat = fs.statSync(basePath + '/' + file)
            const extName = path.extname(file)
            if (stat.isDirectory() && (extName === '.chan' || extName === '.channel')) {
                const channelName = file.replace(extName, '')
                const channelUrn = encodeBase64String(file)
                const model: PSChannelModel = {
                    create_time: "", creator: "", profile: "", update_time: "",
                    image: '',
                    name: channelName,
                    description: '',
                    urn: channelUrn
                }
                const metadataFile = basePath + '/' + file + '/metadata.md'
                if (fs.existsSync(metadataFile)) {
                    const statIndex = fs.statSync(metadataFile)
                    model.create_time = statIndex.birthtime.toISOString()
                    model.update_time = statIndex.mtime.toISOString()
                    const metadataText = fs.readFileSync(metadataFile, 'utf-8')
                    const metadata = frontMatter(metadataText).attributes as
                        { image: string, description: string, title: string }
                    if (metadata) {
                        if (metadata.description) {
                            model.description = metadata.description
                        }
                        if (metadata.image) {
                            const imageAssetUrn = encodeBase64String(metadata.image)
                            model.image = imageAssetUrn
                        }
                        if (metadata.title) {
                            model.name = metadata.title
                        }
                    }
                }
                channels.push(model)
            }
        }
        return {
            range: channels,
            count: channels.length,
            page: 1,
            size: channels.length
        }
    }

    async readAssets(channelUrn: string, fileUrn: string) {
        const channelPath = decodeBase64String(channelUrn)
        const assetsPath = decodeBase64String(fileUrn)
        const fullPath = path.join(this.systemDomain, channelPath, assetsPath)

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
