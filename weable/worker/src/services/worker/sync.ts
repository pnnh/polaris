import {serverConfig} from "@/services/server/config";
import {NPPictureService} from "@/services/personal/picture";

// 由定时任务调用，同步文章数据到本地数据库
export async function runSync() {
    // const domainUrl = serverConfig.INITIAL_DOMAINS
    // const articleService = new NPPictureService(domainUrl)
    // await articleService.runtimeSyncPictures()
}
