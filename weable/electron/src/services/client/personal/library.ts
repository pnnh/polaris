import {PLSelectResult, NPLibraryModel} from "@pnnh/venus-business";
import {clientSigninDomain} from "@/services/client/domain";

export async function selectLibraries() {
    const domain = await clientSigninDomain()
    const pageSize = 64
    const url = '/personal/libraries?' + `page=1&size=${pageSize}`
    return await domain.makeGet<PLSelectResult<NPLibraryModel>>(url)
}
