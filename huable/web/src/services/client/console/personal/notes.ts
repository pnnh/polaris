import {clientSigninDomain} from "@/services/client/domain";
import {PSNoteModel} from "@/models/personal/note";
import {PLSelectResult} from "@/models/common-result";

export async function selectNotes(libraryUrn: string, notebookUrn: string, queryString: string = '') {
    const domain = await clientSigninDomain({} as any)
    const url = `/personal/libraries/${libraryUrn}/notebooks/${notebookUrn}/notes?${queryString}`
    return await domain.makeGet<PLSelectResult<PSNoteModel>>(url)
}

interface DatabaseArticleItem {
    article: PSNoteModel;
    timestamp: number;
}
