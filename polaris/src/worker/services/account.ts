import pg from "pg";
import {AccountModel} from "@/models/common/account";

export async function ensureAccount(client: pg.Client, email: string | undefined,
                                    nickname: string | undefined, website: string | undefined,
                                    photo: string | undefined,
                                    fingerprint: string | undefined,
): Promise<AccountModel> {
    const insertSql = `
    insert into accounts(urn, nickname, create_time, update_time, email, website, photo, fingerprint, domain, directory)
values (gen_random_uuid(), $2, now(), now(), $1, $3, $4, $5, null, null)
on conflict (email) do nothing;`

    const insertParams = [email, nickname, website, photo, fingerprint]

    const insertResult = await client.query(insertSql, insertParams)
    if (!insertResult || !insertResult.rowCount || insertResult.rowCount < 1) {
        throw new Error("account insert failed")
    }

    const selectSql = `select * from accounts where email = $1`
    const selectParams = [email]
    const selectResult = await client.query<AccountModel>(selectSql, selectParams)
    if (!selectResult || !selectResult.rowCount || selectResult.rowCount < 1) {
        throw new Error("account select failed")
    }

    return selectResult.rows[0]
}
