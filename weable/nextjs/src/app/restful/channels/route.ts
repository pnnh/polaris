import {NextRequest, NextResponse} from 'next/server'
import {SystemChannelService} from "@/services/server/domain/system/channel";
import {serverConfig} from "@/services/server/config";

export async function GET(request: NextRequest) {
    console.debug('restful:', request.url, request.nextUrl.pathname)
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const channelService = new SystemChannelService(domainUrl)

    const result = await channelService.selectChannels()
    return NextResponse.json(result)
}
