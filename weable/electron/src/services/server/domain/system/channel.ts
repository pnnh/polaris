import {PSChannelModel} from "@/models/channel";
import fs from "node:fs";
import frontMatter from "front-matter";
import path from "path";
import {stringToMd5} from "@pnnh/atom";

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
            if (stat.isDirectory() && file.endsWith('.chan')) {
                const channelName = file.replace('.chan', '')
                const model: PSChannelModel = {
                    create_time: "", creator: "", profile: "", update_time: "",
                    uid: stringToMd5(channelName),
                    image: '',
                    name: channelName,
                    description: '',
                    urn: channelName
                }
                const metadataFile = basePath + '/' + file + '/metadata.md'
                if (fs.existsSync(metadataFile)) {
                    const metadataText = fs.readFileSync(metadataFile, 'utf-8')
                    const metadata = frontMatter(metadataText).attributes as
                        { image: string, description: string, title: string }
                    if (metadata) {
                        if (metadata.description) {
                            model.description = metadata.description
                        }
                        if (metadata.image) {
                            model.image = `assets://${metadata.image}`
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

    async readAssets(channelName: string, filePath: string) {
        if (!filePath.startsWith('assets/')) {
            throw new Error('只允许读取assets文件')
        }
        const channelPath = `${channelName}.chan`
        const fullPath = path.join(this.systemDomain, channelPath, filePath)
        if (fs.existsSync(fullPath)) {
            return fs.readFileSync(fullPath)
        }
        throw new Error("Method not implemented.");
    }
}
