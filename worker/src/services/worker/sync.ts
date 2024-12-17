import {serverConfig} from "@/services/server/config";
import {SystemArticleService} from "@pnnh/polaris-business";
import {openMainDatabase} from "@/services/server/localdb/sqlite";

// 由定时任务调用，同步文章数据到本地数据库
export async function runSync() {
    const domainUrl = serverConfig.INITIAL_DOMAINS
    const articleService = new SystemArticleService(domainUrl)
    const sqliteClient = await openMainDatabase()
    await articleService.runtimeSyncArticles(sqliteClient)
}
