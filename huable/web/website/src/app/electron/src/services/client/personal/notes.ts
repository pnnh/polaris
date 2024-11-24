import {PLSelectResult, PSNoteModel} from "@pnnh/polaris-business";
import {clientSigninDomain} from "@/services/client/domain";
import {openDatabase} from "@/services/client/database";

export async function selectNotes(libraryUrn: string, notebookUrn: string, queryString: string = '') {
    const domain = await clientSigninDomain()
    const url = `/personal/libraries/${libraryUrn}/notebooks/${notebookUrn}/notes?${queryString}`
    return await domain.makeGet<PLSelectResult<PSNoteModel>>(url)
}

interface DatabaseArticleItem {
    article: PSNoteModel;
    timestamp: number;
}

export async function storeArticleToDatabase(article: PSNoteModel) {
    const db = await openDatabase('articles', 1);
    const tx = db.transaction('keyVal', 'readwrite');
    const store = tx.objectStore('keyVal');

    const dbKey = 'article-' + article.urn;
    const nowValue = await store.get(dbKey) as DatabaseArticleItem;
    const nowDate = new Date();

    const newValue: DatabaseArticleItem = {
        article: article,
        timestamp: nowDate.getTime(),
    };
    await store.put(newValue, dbKey);
    await tx.done;
    if (nowValue) {
        if (nowValue.timestamp <= nowDate.getTime() - 1000) {
            // 每一秒向服务端同步一次文章状态
            await window.serverAPI.storeArticle(article)
        }
    }
}