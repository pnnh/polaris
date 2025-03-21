import {NextRequest, NextResponse} from 'next/server'
import {SitemapStream, streamToPromise} from 'sitemap'
import {Readable} from 'stream'
import {SitemapItemLoose} from "sitemap/dist/lib/types";
import {serverPhoenixSignin} from "@/services/server/domain/domain";
import {useServerConfig} from "@/services/server/config";
import {CommonResult, PLSelectResult} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/atom/common/models/article";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const domain = serverPhoenixSignin()
    const url = `/articles?` + `page=1&size=${100}`
    const result = await domain.makeGet<PLSelectResult<PSArticleModel>>(url)
    const serverConfig = useServerConfig()
    const selfUrl = serverConfig.NEXT_PUBLIC_SELF_URL
    let links: SitemapItemLoose[] = []

    if (result && result.data && result.data.range) {
        links = result.data.range.map((article) => {
            return {
                url: `/content/articles/${article.channel}/articles/${article.uid}`,
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
