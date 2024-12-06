import {NextRequest, NextResponse} from 'next/server'
import {serverMustSigninDomain,} from "@/services/server/domain/domain";
import {CommonResult, PLSelectResult} from "@/models/common/common-result";

import {decodeBase64String, encodeBase64String} from "@/utils/basex";
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
    const magicDomain = 'filesystem://home'
    const decodedUrl = decodeBase64String(resUrl)
    const domainUrl = "http://127.0.0.1:7501"
    const filePath = decodedUrl.replace(magicDomain, '~')
    const domain = serverMustSigninDomain(domainUrl)
    const queryPath = encodeURIComponent(encodeBase64String(filePath, {urlEncode: false}))
    const requestPath = `/server/files?path=${queryPath}`
    const result = await domain.makeGet<PLSelectResult<PSFileModel>>(requestPath)
    console.log('result', result)
    if (!result || !result.data || !result.data.range) {
        return NextResponse.json({
            code: 500
        })
    }
    result.data.range.forEach((item) => {
        item.Path = decodedUrl + '/' + item.Name
    })
    return NextResponse.json(result)
}
