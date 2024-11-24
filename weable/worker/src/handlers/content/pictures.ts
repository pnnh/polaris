import {openMainDatabase} from "@/services/server/database";
import {createPaginationByPage} from "@pnnh/atom";
import {CodeOk, CommonResult, NCPictureModel, PLSelectResult} from "@pnnh/venus-business";
import {Request, Response} from "express";
import {serverConfig} from "@/services/server/config";
import {SystemPictureService} from "@/services/server/picture";

// 查找单个文章
export async function findPicture(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS
    const articleService = new SystemPictureService(domainUrl)

    const {channel, article} = request.params;
    const result = await articleService.getImage(channel, article)
    if (!result) {
        return response.json({status: 404})
    }
    return response.json(result)
}

// 查找某个频道里的文章列表
export async function selectFromChannel(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS
    const articleService = new SystemPictureService(domainUrl)

    const {channel, article} = request.params;
    const result = await articleService.selectArticlesInChannel(channel as string)
    return response.json(result)
}

export async function selectPicturesFromDatabase(
    request: Request,
    response: Response,
) {
    const page = 1;
    const size = 10;
    const db = await openMainDatabase();
    const {limit, offset} = createPaginationByPage(page, size);
    const result = await db.all<NCPictureModel[]>(
        `SELECT * FROM images ORDER BY update_time DESC LIMIT :limit OFFSET :offset`,
        {
            ":limit": limit,
            ":offset": offset,
        },
    );
    const count = await db.get<{ total: number }>(
        "SELECT COUNT(*) AS total FROM images",
    );
    if (!count) {
        throw new Error("查询count失败");
    }

    const selectResult: CommonResult<PLSelectResult<NCPictureModel>> = {
        code: CodeOk,
        message: "",
        data: {
            range: result,
            count: count.total,
            page: page,
            size: result.length,
        }
    };
    response.json(selectResult);
}

