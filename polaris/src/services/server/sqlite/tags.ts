import {ISqliteClient} from "@/services/server/sqlite/database";
import {encodeBase64String} from "@/utils/basex";


export async function bulkInsertOrUpdateTags(sqliteClient: ISqliteClient, channelUrn: string, articleUrn: string, tags: string) {
    const stmt = await sqliteClient.prepare(`INSERT 
            INTO tags (urn, name, description, article, create_time, update_time, channel)
            VALUES ($urn, $name, $description, $article, $create_time, $update_time, $channel)
            ON CONFLICT(urn) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                article = excluded.article,
                update_time = excluded.update_time,
                channel = excluded.channel
            WHERE tags.urn = excluded.urn;`)
    const now = new Date().toISOString()
    const tagList = tags.trim().split(',')
    for (let tag of tagList) {
        tag = tag.trim()
        if (!tag) {
            continue
        }
        await stmt.run({
            $urn: encodeBase64String(tag),
            $name: tag,
            $description: '',
            $article: articleUrn,
            $create_time: now,
            $update_time: now,
            $channel: channelUrn
        });
    }
    await stmt.finalize()
}

