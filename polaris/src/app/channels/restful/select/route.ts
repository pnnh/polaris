
import {NextRequest, NextResponse} from "next/server";
import {SystemChannelService} from "@/services/server/content/channel";
import {CodeOk, PLSelectResult} from "@/models/common/protocol";
import {PSChannelModel} from "@/models/common/channel";

// 查询频道列表
export async function GET(request: NextRequest, response: NextResponse) {
    const channelService = new SystemChannelService('./data')

    const channelsResult = await channelService.selectChannels()

    const responseResult: PLSelectResult<PSChannelModel> = {
        data: channelsResult,
        message: 'success',
        code: CodeOk
    }

    return NextResponse.json(responseResult)
}
