import {Request, Response} from "express";
import {createPaginationByPage} from "@/utils/pagination";
import {openMainDatabase} from "@/worker/database/database";
import {CodeOk, PLSelectResult} from "@/models/common/protocol";
import {PSTagModel} from "@/models/common/tag";

export async function selectTagsFromDatabase(
    request: Request,
    response: Response,
) {
    let page = 1;
    let size = 10;
    const {page: pageStr, size: sizeStr, keyword} = request.query;
    if (pageStr && sizeStr) {
        page = parseInt(pageStr as string);
        size = parseInt(sizeStr as string);
    }
    if (page <= 0 || isNaN(page)) {
        page = 1;
    }
    if (size <= 10 || isNaN(size)) {
        size = 10;
    }
    const db = await openMainDatabase();
    const {limit, offset} = createPaginationByPage(page, size);

    let selectSql = `SELECT * FROM tags WHERE 1 = 1 `;
    let selectParams: any = {}

    if (keyword) {
        selectSql += ` AND (title LIKE '%' || :keyword || '%' OR description LIKE '%' || :keyword || '%') `;
        selectParams[":keyword"] = keyword;
    }

    const count = await db.get<{ total: number }>(
        `SELECT COUNT(*) AS total FROM (${selectSql}) as temp`, selectParams
    );
    if (!count) {
        throw new Error("查询count失败");
    }
    selectSql += ` ORDER BY 'update_time' DESC LIMIT :limit OFFSET :offset`;
    selectParams[":limit"] = limit;
    selectParams[":offset"] = offset;
    const result = await db.all<PSTagModel[]>(
        selectSql, selectParams,
    );

    const selectResult: PLSelectResult<PSTagModel> = {
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
