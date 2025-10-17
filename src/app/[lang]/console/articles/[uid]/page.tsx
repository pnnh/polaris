import React from 'react'
import {PageMetadata, pageTitle} from "@/utils/page";
import {getClientIp, getPathname} from "@/services/server/pathname";
import {tryBase58ToUuid, mustBase58ToUuid, uuidToBase58} from "@/atom/common/utils/basex";
import {CodeOk, CommonResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {useServerConfig} from "@/services/server/config";
import {getLangDefault, langEn, langZh, localText} from "@/atom/common/language";
import {notFound, redirect} from "next/navigation";
import ConsoleLayout from "@/components/server/console/layout";
import {ConsoleArticleForm} from "@/app/[lang]/console/articles/[uid]/form";
import {serverConsoleGetArticle, serverGetArticle} from "@/services/server/articles/articles";
import {PSArticleModel} from "@/photon/common/models/article";
import {EmptyUUID} from "@/atom/common/utils/uuid";

export const dynamic = "force-dynamic";

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, uid: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const searchValue = await searchParams;
    const pageLang = paramsValue.lang || langZh
    const metadata = new PageMetadata(pageLang)
    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    const articleUid = tryBase58ToUuid(paramsValue.uid)
    const isNew = articleUid === EmptyUUID;
    let model: PSArticleModel | undefined = undefined;
    const wantLang = searchValue.wantLang || pageLang;
    const copyFrom = searchValue.copyFrom
    if (isNew) {
        let channelUid = '';
        if (searchValue.channel) {
            channelUid = mustBase58ToUuid(searchValue.channel);
        }
        model = {
            full_repo_path: "", full_repo_url: "", repo_url: "", url: "",
            name: "",
            channel_name: "",
            channel: channelUid,
            cover: "",
            coverUrl: "",
            creator: "",
            discover: 0,
            header: "",
            owner: "",
            partition: "",
            path: "",
            uid: EmptyUUID,     // 设置为空以供form表单识别是新建文章
            title: '',
            description: '',
            keywords: '',
            body: '',
            lang: wantLang,
            create_time: '',
            update_time: ''
        }
        if (copyFrom) {
            const copyFromUid = mustBase58ToUuid(copyFrom);
            const originModel = await serverConsoleGetArticle(pageLang, portalUrl, copyFromUid)
            if (!originModel) {
                throw new Error(localText(pageLang, '无法找到要复制的文章', 'Cannot find the article to copy'));
            }
            model.name = originModel.name;
            model.channel = originModel.channel;
            model.cover = originModel.cover;
            model.header = originModel.header;
            model.title = originModel.title;
            model.description = originModel.description;
            model.keywords = originModel.keywords;
            model.body = originModel.body;
        }
    } else {
        if (!articleUid) {
            notFound();
        }
        model = await serverConsoleGetArticle(pageLang, portalUrl, articleUid, wantLang)
        if (!model || !model.uid) {
            if (wantLang) {
                const createUrl = `/${pageLang}/console/articles/${uuidToBase58(EmptyUUID)}?wantLang=${wantLang}&copyFrom=${uuidToBase58(articleUid)}`;
                redirect(createUrl)
            } else {
                notFound();
            }
            return
        }
        metadata.title = pageTitle(pageLang, model.title)

        metadata.description = model.description
        metadata.keywords = model.keywords

        if (!model.body) {
            return <div>{localText(pageLang, '暂不支持的文章类型', 'Unsupported article type')}</div>
        }
    }
    const modelString = JSON.stringify(model)
    return <ConsoleLayout lang={pageLang} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <ConsoleArticleForm portalUrl={portalUrl} modelString={modelString} lang={pageLang} copyFrom={copyFrom}/>
    </ConsoleLayout>
}
