import {PLSelectResult, NPAlbumModel} from "@pnnh/venus-business";
import {clientSigninDomain} from "@/services/client/domain";

export async function selectAlbums(libraryUrn: string, queryString: string = '') {
    const domain = await clientSigninDomain()
    const url = `/personal/libraries/${libraryUrn}/albums?${queryString}`
    return await domain.makeGet<PLSelectResult<NPAlbumModel>>(url)
}
