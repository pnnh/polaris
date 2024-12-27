
import {openMainPGDatabase} from "@/services/server/postgresql/postgresql";
import {ensureAccount} from "@/services/server/postgresql/account";
import {PSCommentModel} from "@/models/common/comment";
import {validateEmail} from "@/utils/email";
import {uuidV7} from "@/utils/uuid";

export async function selectComments(): Promise<PSCommentModel[]> {
    const client = await openMainPGDatabase()
    const queryResult = await client.query<PSCommentModel>('SELECT * FROM comments where status = 1 order by create_time desc')

    return queryResult.rows
}

export async function insertComment(
    nickname: string | undefined, email: string | undefined, website: string | undefined,
    photo: string | undefined, fingerprint: string | undefined,
    content: string, ipAddress: string | undefined
) {
    const client = await openMainPGDatabase()
    let accountId: string | null = null
    if (email && validateEmail(email)) {
        const accountResult = await ensureAccount(client, email, nickname, website, photo, fingerprint)
        console.log("insertComment", accountResult)
        if (accountResult) {
            accountId = accountResult.urn
        }
    }
    const commentId = uuidV7()
    const insertSql = `
    insert into comments(urn, content, create_time, update_time, creator, thread, referer, domain, directory, 
        resource, ipaddress)
values($1, $2, now(), now(), $3, null, null, null, null, null, $4)
on conflict (urn)
do update set content = excluded.content, update_time = now();
    `
    const insertParams = [commentId, content, accountId, ipAddress]

    const insertResult = await client.query(insertSql, insertParams)
    if (!insertResult || !insertResult.rowCount || insertResult.rowCount < 1) {
        throw new Error("comment insert failed")
    }
    return commentId
}
