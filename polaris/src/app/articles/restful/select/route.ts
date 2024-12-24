import {NextRequest, NextResponse} from "next/server";
import {createPaginationByPage} from "@/utils/pagination";
import {openMainDatabase} from "@/services/server/localdb/sqlite";
import {PSArticleModel} from "@/models/common/article";
import {CodeOk, PLSelectResult} from "@/models/common/protocol";

export async function GET(
    request: NextRequest, response: NextResponse) {
    let page = 1;
    let size = 10;
    const pageStr = request.nextUrl.searchParams.get("page")
    const sizeStr = request.nextUrl.searchParams.get("size")
    const keyword = request.nextUrl.searchParams.get("keyword")
    const filter = request.nextUrl.searchParams.get("filter")
    const sort = request.nextUrl.searchParams.get("sort")
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

    let selectSql = `SELECT * FROM articles WHERE 1 = 1 `;
    let selectParams: any = {}

    if (keyword) {
        selectSql += ` AND (title LIKE '%' || :keyword || '%' OR description LIKE '%' || :keyword || '%' OR body LIKE '%' || :keyword || '%') `;
        selectParams[":keyword"] = keyword;
    }
    if (filter) {
        if (filter === 'year') {
            selectSql += ` AND strftime('%Y', update_time) = strftime('%Y', 'now') `;
        } else if (filter === 'month') {
            selectSql += ` AND strftime('%Y-%m', update_time) = strftime('%Y-%m', 'now') `;
        }
    }

    const count = await db.get<{ total: number }>(
        `SELECT COUNT(*) AS total FROM (${selectSql}) as temp`, selectParams
    );
    if (!count) {
        throw new Error("查询count失败");
    }
    selectSql += ` ORDER BY ${sort === 'latest' ? 'update_time' : 'discover'} DESC LIMIT :limit OFFSET :offset`;
    selectParams[":limit"] = limit;
    selectParams[":offset"] = offset;
    const result = await db.select<PSArticleModel>(
        selectSql, selectParams,
    );

    const selectResult: PLSelectResult<PSArticleModel> = {
        code: CodeOk,
        message: "",
        data: {
            range: result,
            count: count.total,
            page: page,
            size: result.length,
        }
    };
    return NextResponse.json(selectResult)
}
