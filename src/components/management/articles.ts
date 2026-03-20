import {CodeOk, PLSelectData, PLSelectResult} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {cookies} from "next/headers";
import queryString from "query-string";
import {transKey} from "@/components/common/locales/normal";

export class ManagementArticleService {
    /**
     * Fetch the full article list for admin review.
     * Calls GET /stargate/management/articles
     * Query params: keyword, status ("pending"|"approved"), page, size, sort
     */
    static async queryArticles(
        stargateUrl: string,
        lang: string,
        queryParams: Record<string, unknown>
    ): Promise<PLSelectData<PSArticleModel>> {
        const rawQuery = queryString.stringify(queryParams)
        const url = `${stargateUrl}/management/articles?${rawQuery}`
        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()

        const getResult = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, authHeader);
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            throw new Error(transKey(lang, 'management.article.getListFailed'));
        }
        const selectData = getResult.data
        if (!selectData || !selectData.range) {
            throw new Error(transKey(lang, 'management.article.getListFailed'));
        }
        return selectData;
    }
}
