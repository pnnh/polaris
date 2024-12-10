
import {clientSigninDomain} from "@/services/client/domain";
import {useClientConfig} from "@/services/client/config";
import {PLSelectResult} from "@/models/common/protocol";
import {PSNotebookModel} from "@/models/common/personal/notebook";

export async function selectNotebooks(libraryUrn: string, queryString: string = '') {
    const clientConfig = useClientConfig()
    const domain = await clientSigninDomain(clientConfig)
    const url = `/personal/libraries/${libraryUrn}/notebooks?${queryString}`
    const result = await domain.makeGet<PLSelectResult<PSNotebookModel>>(url)
    return result
}
