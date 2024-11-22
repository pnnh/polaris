import {NextRequest, NextResponse} from 'next/server'
import {SitemapStream, streamToPromise} from 'sitemap'
import {Readable} from 'stream'
import {SitemapItemLoose} from "sitemap/dist/lib/types";
import {serverMustSigninDomain,} from "@/services/server/domain/domain";
import {useServerConfig} from "@/services/server/config";
import {CommonResult, PLSelectResult} from "@/models/common/common-result";
import {PSArticleModel} from "@/models/common/article";
import {decodeBase64String} from "@/utils/basex";
import {PSFileModel} from "@/models/common/filesystem";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, response: NextResponse) {
    const resUrl = request.nextUrl.searchParams.get("url");

    console.log('resUrl', resUrl)
    if (!resUrl) {
        return NextResponse.json({
            code: 500
        })
    }
    const decodedUrl = decodeBase64String(resUrl)
    const domain = serverMustSigninDomain(decodedUrl)
    const result = await domain.makeGet<PLSelectResult<PSFileModel>>('')

    return NextResponse.json(result)
}
