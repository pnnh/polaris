
import {Request, Response} from "express";
import {SystemChannelService} from "@/worker/services/channel";
import {mustGetFirstDir} from "@/services/server/config";

// 查询频道列表
export async function selectChannels(request: Request, response: Response) {
    const domainUrl = mustGetFirstDir()

    const channelService = new SystemChannelService(domainUrl)

    const result = await channelService.selectChannels()
    return response.json(result)
}

// 查找单个文章
export async function fetchChannelFile(request: Request, response: Response) {
    const domainUrl = mustGetFirstDir()
    const channelService = new SystemChannelService(domainUrl)
    const {channel, asset} = request.params
    const result = await channelService.readAssets(String(channel), asset as string)

    if (!result) {
        return response.json({status: 404})
    }
    response.setHeader('Content-Type', result.mime)
    response.send(result.buffer);
}
