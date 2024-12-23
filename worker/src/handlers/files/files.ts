
// 查询频道列表
import {Request, Response} from "express";
import {SystemFileService} from "@pnnh/polaris-business";

export async function selectFiles(request: Request, response: Response) {

    const channelService = new SystemFileService()

    const {pathUrl} = request.query

    const result = await channelService.selectFiles(pathUrl as string, {directory:true})
    return response.json(result)
}
