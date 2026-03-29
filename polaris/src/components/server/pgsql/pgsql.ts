import pgPromise, {IDatabase} from 'pg-promise'
import {IClient} from "pg-promise/typescript/pg-subset";
import {serverGetGlobalVariable, serverSetGlobalVariable} from "@pnnh/atom/nodejs";

// const serverConfig = await useServerConfig()
// const connString = serverConfig.DATABASE_URL

// const client = new Client({
//     connectionString: connString
// })
// await client.connect()

const defaultDBName = "default";
const pgPoolMapKey = 'pgPoolMap';
serverSetGlobalVariable(pgPoolMapKey, new Map<string, IDatabase<{}, IClient>>());

export async function initPgdbFor(dbName: string, dbUrl: string) {
    const pgPoolMap: Map<string, IDatabase<{}, IClient>> = await serverGetGlobalVariable('pgPoolMap');
    if (pgPoolMap.has(dbName)) {
        return
    }
    const db = pgPromise()(dbUrl)
    pgPoolMap.set(dbName, db);
}

export async function initPgdb(dbUrl: string) {
    return initPgdbFor(defaultDBName, dbUrl);
}

export async function pgGetDb(dbName: string) {
    const pgPoolMap: Map<string, IDatabase<{}, IClient>> = await serverGetGlobalVariable(pgPoolMapKey);
    return pgPoolMap.get(dbName);
}

export async function pgQueryOneFor(dbName: string, query: string, params: any = {}) {
    const db = await pgGetDb(dbName);
    if (!db) {
        throw new Error(`Failed to get pool for ${dbName}`);
    }
    if (!query || !params) {
        throw new Error(`Failed to get query for 2 ${dbName}`);
    }
    // const res = await pool.query('SELECT $1::text as message', ['Hello world!'])
    // console.log(res.rows[0].message) // Hello world!

//     const testSql = `
//      select c.content
// from configuration c
// where c.name = $/name/  limit 1;
//     `

    const queryResult = await db.one(query, params)
    // console.log('queryResult', queryResult) // Hello world!
    return queryResult
}

export async function pgQueryOne(query: string, params: any = {}) {
    return pgQueryOneFor(defaultDBName, query, params)
}
