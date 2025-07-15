import styles from './page.module.scss'
import React from 'react'

import {serverPortalSignin} from "@/services/server/domain/domain";
import {PageMetadata, pageTitle} from "@/utils/page";
import {getClientIp, getPathname} from "@/services/server/pathname";
import {generatorRandomString, STSubString} from "@/atom/common/utils/string";
import {base58ToUuid} from "@/atom/common/utils/basex";
import {CodeOk, CommonResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {PSArticleModel} from "@/photon/common/models/article";
import {TocItem} from "@/atom/common/models/toc";
import {getDefaultNoteImageByUid} from "@/services/common/note";
import {isValidUUID} from "@/atom/common/utils/uuid";
import {useServerConfig} from "@/services/server/config";
import {langEn} from "@/atom/common/language";
import {getLanguageProvider} from "@/services/common/language";
import {notFound} from "next/navigation";
import ConsoleLayout from "@/components/server/content/console/layout";
import {ConsoleArticleEditor} from "@/app/[lang]/console/articles/[uid]/editor";
import Button from "@mui/material/Button";

export const dynamic = "force-dynamic";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, uid: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const metadata = new PageMetadata(lang)
    const searchParamsValue = await searchParams
    let domain = serverPortalSignin()
    const articleUrn = base58ToUuid(paramsValue.uid)
    if (!articleUrn) {
        notFound();
    }
    const url = `/articles/${articleUrn}`
    const getResult = await domain.makeGet<CommonResult<PSArticleModel | undefined>>(url)

    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        return <div>遇到错误</div>
    }
    const model = getResult.data
    metadata.title = pageTitle(lang, getResult.data.title)

    metadata.description = getResult.data.description
    metadata.keywords = getResult.data.keywords

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({title: getResult.data.title, header: 0, id: titleId})
    if (!getResult.data.body) {
        return <div>暂不支持的文章类型</div>
    }
    const clientIp = await getClientIp()
    // 更新文章阅读次数
    if (clientIp) {
        await domain.makePost(`/articles/${articleUrn}/viewer`, {clientIp})
    }
    const readUrl = `/${lang}/articles/articles/${paramsValue.uid}`
    let imageUrl = getDefaultNoteImageByUid(model.uid)
    if (model.cover && isValidUUID(model.cover)) {
        imageUrl = domain.assetUrl(`/articles/${model.uid}/assets/${model.cover}`)
    }
    const serverConfig = useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    const langProvider = getLanguageProvider(lang)
    return <ConsoleLayout lang={lang} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={styles.bodyContainer}>
            <div className={styles.articleCover}>
                <div className={styles.articleHeader}>
                    <h1 className={styles.articleTitle} id={titleId}>
                        <input value={getResult.data.title}/>
                    </h1>
                    <div className={styles.articleDescription}>
                        <textarea
                            name={'articleDescription'}>{STSubString(model.description || model.body, 80)}</textarea>
                    </div>
                </div>
                <img className={styles.coverImage} src={imageUrl} alt={model.title}/>
            </div>
            <div className={styles.articleContainer}>
                <ConsoleArticleEditor tocList={tocList} header={getResult.data.header}
                                      body={getResult.data.body}
                                      assetsUrl={'assetsUrl'} portalUrl={portalUrl}/>
            </div>
            <div className={styles.bottomBar}>
                <Button variant={'contained'} size={'small'}>保存</Button>
                <Button variant={'contained'} size={'small'}>发布</Button>
            </div>
        </div>
    </ConsoleLayout>
}
