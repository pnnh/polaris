import {PLSelectResult, PSNotebookModel} from "@pnnh/polaris-business";
import {clientSigninDomain} from "@/services/client/domain";

export async function selectNotebooks(libraryUrn: string, queryString: string = '') {
    const domain = await clientSigninDomain()
    const url = `/personal/libraries/${libraryUrn}/notebooks?${queryString}`
    const result = await domain.makeGet<PLSelectResult<PSNotebookModel>>(url)
    return result
}
