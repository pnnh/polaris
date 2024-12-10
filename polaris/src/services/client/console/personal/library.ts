
import {clientSigninDomain} from "@/services/client/domain";
import {PLSelectResult} from "@/models/common/protocol";
import {PSLibraryModel} from "@/models/common/personal/library";
import {useClientConfig} from "@/services/client/config";

export async function selectLibraries() {
    const clientConfig = useClientConfig()
    const domain = await clientSigninDomain(clientConfig)
    const pageSize = 64
    const url = '/personal/libraries?' + `page=1&size=${pageSize}`
    return await domain.makeGet<PLSelectResult<PSLibraryModel>>(url)
}
