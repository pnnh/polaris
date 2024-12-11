
import pg from 'pg'
import {useServerConfig} from "@/services/server/config";

const databaseMap: Map<string, pg.Client> = new Map()

export async function openPGDatabase(dsn: string): Promise<pg.Client> {
    if (databaseMap.has(dsn)) {
        return databaseMap.get(dsn) as pg.Client
    }

    const dsnUrl = new URL(dsn);
    const {Client} = pg
    const databaseName = dsnUrl.pathname.replaceAll('/', '')
    // const hostSplit = dsnUrl.host.split(":")
    // let databaseHost = dsnUrl.host
    // let databasePort =
    // if (hostSplit.length > 1) {
    //     databaseHost = hostSplit[0];
    // }
    const databasePassword = decodeURIComponent(dsnUrl.password)
    const client = new Client({
        host: dsnUrl.hostname,
        port: parseInt(dsnUrl.port),
        user: dsnUrl.username,
        password: databasePassword,
        database: databaseName,
    })
    await client.connect()

    databaseMap.set(dsn, client)
    return client
}

export async function openMainPGDatabase() {
    const serverConfig = useServerConfig()
    const mainDatabasePath = serverConfig.PGDATABASE
    if (!mainDatabasePath) {
        throw new Error('Missing database connection')
    }
    return openPGDatabase(mainDatabasePath)
}
