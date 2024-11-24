import {serverConfig} from "@/services/server/config";
import {Request, Response} from "express";
import {SystemChannelService} from "@/services/server/channel";

// 查询频道列表
export async function selectChannels(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const channelService = new SystemChannelService(domainUrl)

    const result = await channelService.selectChannels()
    return response.json(result)
}

// export async function GET(request: NextRequest, { params }: { params: { channel: string, path: string[] } }) {
//     console.debug('restful:', request.url, request.nextUrl.pathname)
//
//     const domainUrl = serverConfig.INITIAL_DOMAINS
//     const channelService = new SystemChannelService(domainUrl)
//     const { channel, path } = params
//     const result = await channelService.readAssets(String(channel), (path as string[]).join('/'))
//
//     const mimeType = getType(params.path[params.path.length - 1])
//
//     return new Response(result, { headers: { 'Content-Type': mimeType } });
// }
