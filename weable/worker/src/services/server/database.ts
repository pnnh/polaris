import sqlite3 from 'sqlite3'
import {Database, open} from 'sqlite'
import {numberVersion} from "@/version";
import {serverConfig} from "@/services/server/config";
import {NPPictureModel} from "@pnnh/venus-business";

const databaseMap: Map<string, Database<sqlite3.Database>> = new Map()

export async function openDatabase(filename: string): Promise<Database<sqlite3.Database>> {
    if (databaseMap.has(filename)) {
        return databaseMap.get(filename) as Database<sqlite3.Database>
    }
    const database = await open({
        filename: filename,
        driver: sqlite3.cached.Database
    })
    databaseMap.set(filename, database)
    return database
}

export async function openMainDatabase() {
    const mainDatabasePath = `${serverConfig.DATA_PATH}/polaris.${numberVersion}.db`
    return openDatabase(mainDatabasePath)
}

export async function bulkInsertOrUpdateArticles(images: NPPictureModel[]) {
    // const db = await openMainDatabase()
    // await db.exec('BEGIN TRANSACTION;')
    // const stmt = await db.prepare(`INSERT OR REPLACE
    //         INTO images (uid, urn, title, header, body, create_time, update_time, creator, keywords, description,
    //             cover, discover, owner, channel, partition, path)
    //         VALUES ($uid, $urn, $title, $header, $body, $create_time, $update_time, $creator, $keywords, $description,
    //             $cover, $discover, $owner, $channel, $partition, $path);`)
    // for (const article of images) {
    //     await stmt.run({
    //         $uid: article.uid,
    //         $urn: article.urn,
    //         $title: article.title,
    //         $header: article.header,
    //         $body: article.body,
    //         $create_time: article.create_time,
    //         $update_time: article.update_time,
    //         $creator: article.creator,
    //         $keywords: article.keywords,
    //         $description: article.description,
    //         $cover: article.cover,
    //         $discover: article.discover,
    //         $owner: article.owner,
    //         $channel: article.channel,
    //         $partition: article.partition,
    //     });
    // }
    // await stmt.finalize()
    // await db.exec('COMMIT;')
}
