import {IAppConfig} from "@/services/common/config";
import {PLSelectResult, PSLibraryModel, PSFileModel, PSNoteModel, ISelectFilesOptions} from "@pnnh/polaris-business";

export {} // 该行不能去掉，否则会提示类型不存在

declare global {
    interface Window {
        serverAPI: {
            getAppConfig: () => Promise<IAppConfig>
            storeArticle: (article: PSNoteModel) => Promise<void>
            selectFiles: (parentPath: string, options: ISelectFilesOptions | undefined) => Promise<PLSelectResult<PSFileModel>>
            getDomainPath: () => Promise<string>
            setDomainPath: (path: string) => Promise<void>
        }
    }
}
