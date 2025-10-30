import {NextRequest, NextResponse} from 'next/server'
import {SitemapStream, streamToPromise} from 'sitemap'
import {Readable} from 'stream'
import {SitemapItemLoose} from "sitemap/dist/lib/types";
import {useServerConfig} from "@/components/server/config";
import {CommonResult, PLSelectResult} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/photon/common/models/article";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {langEn, langZh} from "@/atom/common/language";
import {serverMakeGet} from "@/atom/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.PUBLIC_PORTAL_URL
    const url = `${serverUrl}/articles?` + `page=1&size=${100}`
    const result = await serverMakeGet<PLSelectResult<PSArticleModel>>(url, '')
    const selfUrl = serverConfig.PUBLIC_SELF_URL
    let links: SitemapItemLoose[] = []

    if (result && result.data && result.data.range) {
        links = result.data.range.map((article) => {
            const readUrl = `/articles/${uuidToBase58(article.uid)}`
            return {
                url: `/${langEn}${readUrl}`,
                lastmod: article.update_time,
                links: [
                    {lang: 'x-default', url: `/${langEn}${readUrl}`},
                    {lang: 'en', url: `/${langEn}${readUrl}`},
                    {lang: 'zh', url: `/${langZh}${readUrl}`},
                ]
            }
        })
    }
    const stream = new SitemapStream({hostname: selfUrl})
    const data = await streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
        data.toString()
    )
    return new Response(data, {headers: {'Content-Type': 'application/xml'}})
}
