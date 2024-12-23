
import {ISelectFilesOptions, PLSelectResult, PSFileModel, PSNoteModel} from "@pnnh/polaris-business";
import {clientMakeHttpGet} from "@/services/http";

export async function fetchSelectFiles(parentPath: string, options: ISelectFilesOptions | undefined): Promise<PLSelectResult<PSFileModel>> {
    const url = 'http://127.0.0.1:7101/files?pathUrl=' + encodeURIComponent(parentPath)
    return await clientMakeHttpGet<PLSelectResult<PSFileModel>>(url)

}
