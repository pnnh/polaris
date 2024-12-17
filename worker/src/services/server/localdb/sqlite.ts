import {openSqliteDatabase} from "@pnnh/polaris-business";
import {serverConfig} from "@/services/server/config";

export async function openMainDatabase() {
    const mainDatabasePath = `${serverConfig.DATA_PATH}/polaris.db`
    return openSqliteDatabase(mainDatabasePath)
}
