import 'server-only'
import {Client} from 'pg'
import {useServerConfig} from "@/services/server/config";
import {Pool} from 'pg'

const serverConfig = await useServerConfig()
const connString = serverConfig.DATABASE_URL

// const client = new Client({
//     connectionString: connString
// })
// await client.connect()
const pool = new Pool({
    connectionString: connString
})

export async function pgRunSql(query: string, params: any = {}) {
    try {
        const res = await pool.query('SELECT $1::text as message', ['Hello world!'])
        console.log(res.rows[0].message) // Hello world!
    } catch (err) {
        console.error(err);
    } finally {
        //await client.end()
    }
}
