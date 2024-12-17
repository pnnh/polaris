import {PSArticleModel} from "@/common/models/article";
import {bulkInsertOrUpdateTags} from "@/server/sqlite/tags";
import {ISqliteClient} from "@/server/sqlite/database";

export async function bulkInsertOrUpdateArticles(sqliteClient: ISqliteClient, articles: PSArticleModel[]) {

    await sqliteClient.exec('BEGIN TRANSACTION;')
    const stmt = await sqliteClient.prepare(`INSERT 
            INTO articles (urn, title, header, body, create_time, update_time, creator, keywords, description, 
                cover, owner, channel, partition, path)
            VALUES ($urn, $title, $header, $body, $create_time, $update_time, $creator, $keywords, $description, 
                $cover, $owner, $channel, $partition, $path)
            ON CONFLICT(urn) DO UPDATE SET
                title = excluded.title,
                header = excluded.header,
                body = excluded.body,
                create_time = excluded.create_time,
                update_time = excluded.update_time,
                creator = excluded.creator,
                keywords = excluded.keywords,
                description = excluded.description,
                cover = excluded.cover,
                owner = excluded.owner,
                channel = excluded.channel,
                partition = excluded.partition,
                path = excluded.path
            WHERE articles.urn = excluded.urn;`)
    for (const article of articles) {
        const channelUrn = article.channel as string
        await stmt.run({
            $urn: article.urn,
            $title: article.title,
            $header: article.header,
            $body: article.body,
            $create_time: article.create_time,
            $update_time: article.update_time,
            $creator: article.creator,
            $keywords: article.keywords,
            $description: article.description,
            $cover: article.cover,
            $owner: article.owner,
            $channel: channelUrn,
            $partition: article.partition,
        });
        await bulkInsertOrUpdateTags(sqliteClient, channelUrn, article.urn, article.keywords)
    }
    await stmt.finalize()
    await sqliteClient.exec('COMMIT;')
}

