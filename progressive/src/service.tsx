import {IAppConfig} from "@/services/config";
import {ISelectFilesOptions, PLSelectResult, PSFileModel, PSNoteModel} from "@pnnh/polaris-business";
import {fetchSelectFiles} from "@/services/files/files";

if (!window.serverAPI) {
    // 网页环境运行手动设置API
    window.serverAPI = {
        getAppConfig(): Promise<IAppConfig> {
            return Promise.resolve({} as IAppConfig);
        },
        async selectFiles(parentPath: string, options: ISelectFilesOptions | undefined): Promise<PLSelectResult<PSFileModel>> {
            return await fetchSelectFiles(parentPath, options);
        },
        setDomainPath(path: string): Promise<void> {
            return Promise.resolve(undefined);
        },
        storeArticle(article: PSNoteModel): Promise<void> {
            return Promise.resolve(undefined);
        },
        getDomainPath: function () {
            return Promise.resolve("file://data");
        }
    }
}
