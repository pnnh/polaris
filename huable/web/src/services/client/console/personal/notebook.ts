import {clientSigninDomain} from "@/services/client/domain";
import {PLSelectResult} from "@/models/common-result";
import {PSNotebookModel} from "@/models/personal/notebook";

export async function selectNotebooks(libraryUrn: string, queryString: string = '') {
    const domain = await clientSigninDomain({} as any)
    const url = `/personal/libraries/${libraryUrn}/notebooks?${queryString}`
    const result = await domain.makeGet<PLSelectResult<PSNotebookModel>>(url)
    return result
}
