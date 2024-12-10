

import {useServerConfig} from "@/services/server/config";
import {SystemArticleService} from "@/worker/services/article";

// 由定时任务调用，同步文章数据到本地数据库
export async function runSync() {
    const serverConfig = useServerConfig()
    const syncDir = serverConfig.DirectoryList.find(it=>true);    // 第一个
    if (!syncDir) {
        throw new Error("syncDir为空")
    }
    const articleService = new SystemArticleService(syncDir)
    await articleService.runtimeSyncArticles()
}
