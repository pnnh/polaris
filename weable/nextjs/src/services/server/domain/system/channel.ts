import fs from "node:fs";
import ignore from "ignore";
import path from "path";
import {base58ToString, stringToBase58} from "@pnnh/atom";
import {NCChannelModel} from "@pnnh/venus-business";

const fileIgnore = ignore().add(['.git', 'node_modules', 'metadata.md'])

export class SystemChannelService {
    systemDomain: string

    constructor(systemDomain: string) {
        this.systemDomain = systemDomain
    }

    async selectChannels() {
        const basePath = this.systemDomain
        const channels: NCChannelModel[] = []
        const files = fs.readdirSync(basePath)
        for (const file of files) {
            const stat = fs.statSync(basePath + '/' + file)
            const testResult = fileIgnore.test(file)
            if (stat.isDirectory() && !testResult.ignored) {
                const model: NCChannelModel = {
                    create_time: "", creator: "", profile: "", update_time: "",
                    uid: file,
                    image: '',
                    name: file,
                    description: '',
                    urn: stringToBase58(file)
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

    async readAssets(pathParams: { channel: string, path: string } | undefined) {
        const channelUrn = pathParams?.channel
        const filePath = pathParams?.path
        if (!channelUrn || !filePath) {
            throw new Error('channel or path invalid')
        }
        const channelName = base58ToString(channelUrn)

        const fullPath = path.join(this.systemDomain, channelName, filePath)
        if (fs.existsSync(fullPath)) {
            return fs.readFileSync(fullPath)
        }
        throw new Error("Method not implemented.");
    }
}
