import {PLSelectResult, PSNotebookModel, SystemNotebookService} from "@pnnh/polaris-business";
import {serverConfig} from "@/services/server/config";

export async function selectNotebooks(libraryUrn: string, queryString: string = '') {
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const library = ''
    const service = new SystemNotebookService(domainUrl)

    return await service.selectNotebooks(library)
}
