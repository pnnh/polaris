import {PLInsertResult, PSArticleModel} from "@pnnh/polaris-business";
import {openMainDatabase} from "@/services/server/database";
import {createPaginationByPage} from "@/utils/pagination";
import {CodeOk, CommonResult, PLSelectResult} from "@pnnh/polaris-business";
import {Request, Response} from "express";
import {SystemArticleService} from "@/services/server/domain/system/article";
import {serverConfig} from "@/services/server/config";
import {articleViewerCache} from "@/services/server/cache";

// 查找单个文章
export async function findArticle(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS
    const articleService = new SystemArticleService(domainUrl)

    const {channel, article} = request.params;
    const result = await articleService.getArticle(channel, article)
    if (!result) {
        return response.json({status: 404})
    }
    return response.json(result)
}

// 查找某个频道里的文章列表
export async function selectFromChannel(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS
    const articleService = new SystemArticleService(domainUrl)

    const {channel} = request.params;
    const result = await articleService.selectArticlesInChannel(channel as string)
    return response.json(result)
}

export async function selectArticlesFromDatabase(
    request: Request,
    response: Response,
) {
    let page = 1;
    let size = 10;
    const {page: pageStr, size: sizeStr, keyword, filter, sort} = request.query;
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
    const result = await db.all<PSArticleModel[]>(
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
    response.json(selectResult);
}

// 创建或更新文章阅读数据
export async function updateArticleViewer(
    request: Request,
    response: Response,
) {
    const {article} = request.params
    const {clientIp} = request.body;

    if (!clientIp || !article) {
        return response.json({
            code: 400,
            message: "缺少必须参数",
            data: null,
        });
    }
    const cacheKey = `article_viewer_${article}_${clientIp}`;
    const cacheValue = articleViewerCache.get(cacheKey);
    if (cacheValue) {
        return response.json({
            code: 200,
            message: "已经记录过",
            data: null,
        });
    }

    const db = await openMainDatabase();


    let selectSql = `update articles set discover = ifnull(discover, 0) + 1 where urn = :urn`;
    let selectParams: any = {
        ":urn": article,
    }

    const result = await db.run(
        selectSql, selectParams,
    );

    articleViewerCache.set(cacheKey, 1, 60 * 60 * 24);

    const selectResult: PLInsertResult<PSArticleModel> = {
        code: CodeOk,
        message: "",
        data: {
            urn: article,
            changes: result.changes || 0,
        }
    };
    response.json(selectResult);
}

// 查找单个文章
export async function fetchArticleAssets(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS
    const articleService = new SystemArticleService(domainUrl)
    const {channel, article,} = request.params
    const {parent} = request.query
    const result = await articleService.selectFiles(channel, article, parent as string)

    if (!result) {
        return response.json({status: 404})
    }
    const body = {
        code: CodeOk,
        data: result
    }
    response.json(body)
}


// 查找单个文章
export async function fetchArticleFile(request: Request, response: Response) {
    const domainUrl = serverConfig.INITIAL_DOMAINS
    const articleService = new SystemArticleService(domainUrl)
    const {channel, article, asset} = request.params
    const result = await articleService.readAssets(channel, article, asset)

    if (!result) {
        return response.json({status: 404})
    }
    response.setHeader('Content-Type', result.mime)
    response.send(result.buffer);
}
