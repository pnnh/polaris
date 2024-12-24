import {useServerConfig} from "@/services/server/config";
import {openSqliteDatabase} from "@/services/server/sqlite/database";

export async function openMainDatabase() {
    const serverConfig = useServerConfig()
    const mainDatabasePath = `${serverConfig.DATA_PATH}/polaris.db`
    return openSqliteDatabase(mainDatabasePath)
}
