
import {serverConfig} from "@/services/server/config";
import {openSqliteDatabase} from "@/business/server/sqlite/database";

export async function openMainDatabase() {
    const mainDatabasePath = `${serverConfig.DATA_PATH}/polaris.db`
    return openSqliteDatabase(mainDatabasePath)
}
