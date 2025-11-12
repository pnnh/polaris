import {NextRequest} from 'next/server'
import {SitemapItemLoose, SitemapStream, streamToPromise} from 'sitemap'
import {Readable} from 'stream'
import {useServerConfig} from "@/components/server/config";
import {PLSelectResult} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/photon/common/models/article";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {serverMakeGet} from "@/atom/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const url = `${serverUrl}/articles?` + `page=1&size=${100}`
    const result = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')
    const selfUrl = serverConfig.PUBLIC_SELF_URL
    let links: SitemapItemLoose[] = []

    if (result && result.data && result.data.range) {
        links = result.data.range.map((article) => {
            const readUrl = `/articles/${uuidToBase58(article.uid)}`
            return {
                url: `/${article.lang}${readUrl}`,
                lastmod: article.update_time,
            }
        })
    }
    const stream = new SitemapStream({hostname: selfUrl})
    const data = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
        data.toString()
    )
    return new Response(data, {headers: {'Content-Type': 'application/xml'}})
}
