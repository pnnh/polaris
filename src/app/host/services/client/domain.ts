import {PLSelectResult} from "@/atom/common/models/protocol";
import {PSLibraryModel} from "@/components/client/libraries/library";
import {PSArticleModel} from "@/components/common/models/article";
import {PSNotebookModel} from "@/components/common/models/personal/notebook";

export interface IClientDomain {
    selectLibraries(): Promise<PLSelectResult<PSLibraryModel>>

    selectNotebooks(libraryUrn: string, queryString: string): Promise<PLSelectResult<PSNotebookModel>>

    selectNotes(libraryUrn: string, notebookUrn: string, queryString: string): Promise<PLSelectResult<PSArticleModel>>
}

class ClientDomain implements IClientDomain {
    async selectNotes(libraryUrn: string, notebookUrn: string, queryString: string): Promise<PLSelectResult<PSArticleModel>> {
        return await window.serverAPI.selectNotes(libraryUrn, notebookUrn, queryString)
    }

    async selectNotebooks(libraryUrn: string, queryString: string): Promise<PLSelectResult<PSNotebookModel>> {
        return await window.serverAPI.selectNotebooks(libraryUrn, queryString)
    }

    async selectLibraries(): Promise<PLSelectResult<PSLibraryModel>> {
        return await window.serverAPI.selectLibraries()
    }
}

export async function clientSigninDomain(): Promise<IClientDomain> {
    // const appConfig = await window.serverAPI.getAppConfig()
    return new ClientDomain()
}
