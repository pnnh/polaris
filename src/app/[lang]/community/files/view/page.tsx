import React from 'react'
import {getPathname} from "@/components/server/pathname";
import {CodeOk, CommonResult, langEn, SymbolUnknown, tryBase58ToUuid} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";

import {notFound} from "next/navigation";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {CMResourceCard} from "@/components/community/resource";
import {CMFileModel} from "@/components/common/models/community/file";
import {cookies} from "next/headers";
import ConsoleLayout from "@/components/server/console/layout";

export const dynamic = "force-dynamic";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchValue = await searchParams
    const serverConfig = await useServerConfig()
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
    const fileUid = tryBase58ToUuid(searchValue.uid)
    if (!fileUid) {
        notFound();
    }
    const url = `${internalStargateUrl}/community/files/${fileUid}?lang=${lang}`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet<CommonResult<CMFileModel | undefined>>(url, authHeader)

    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return <div>遇到错误3</div>
    }
    const model = getResult.data

    return <ConsoleLayout lang={lang} searchParams={await searchParams} pathname={pathname}
                          userInfo={SymbolUnknown}>
        <div>
            <CMResourceCard lang={lang} model={model}/>
        </div>
    </ConsoleLayout>
}
