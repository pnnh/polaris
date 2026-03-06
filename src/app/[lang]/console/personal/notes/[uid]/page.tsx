import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {EmptyUUID, langZh, mustBase58ToUuid, SymbolUnknown, tryBase58ToUuid, uuidToBase58} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {notFound, redirect} from "next/navigation";
import {ConsoleArticleForm} from "./form";
import {serverConsoleGetNote} from "@/components/personal/notes-server";
import {PSArticleModel} from "@/components/common/models/article";
import ConsoleLayout from "@/components/server/console/layout";
import {css} from "@/gen/styled/css";
import {transKey} from "@/components/common/locales/normal";
import {serverConsoleSelectChannels} from "@/components/server/channels/channels";

const pageStyles = {
    articlesPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
    `,
    pageContainer: css`
    `
}

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
    const internalStargateUrl = serverConfig.INTERNAL_STARGATE_URL
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
            const originModel = await serverConsoleGetNote(pageLang, internalStargateUrl, copyFromUid)
            if (!originModel) {
                throw new Error(transKey(pageLang, 'console.note.cannotFindCopy'));
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
        model = await serverConsoleGetNote(pageLang, internalStargateUrl, articleUid, wantLang)
        if (!model || !model.uid) {
            if (wantLang) {
                const createUrl = `/${pageLang}/console/personal/notes/${uuidToBase58(EmptyUUID)}?wantLang=${wantLang}&copyFrom=${uuidToBase58(articleUid)}`;
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
            return <div>{transKey(pageLang, 'console.note.unsupportedType')}</div>
        }
    }
    
    // Query channels for publishing to community
    const channelsData = await serverConsoleSelectChannels(internalStargateUrl, pageLang, {
        page: 1,
        size: 100
    });
    
    const modelString = JSON.stringify(model)
    const channelsString = JSON.stringify(channelsData.range)
    return <ConsoleLayout lang={pageLang} metadata={metadata} pathname={pathname} searchParams={searchValue}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.articlesPage}>
            <div className={pageStyles.pageContainer}>
                <ConsoleArticleForm stargateUrl={serverConfig.PUBLIC_STARGATE_URL} modelString={modelString}
                                    channelsString={channelsString}
                                    lang={pageLang}/>

            </div>

        </div>
    </ConsoleLayout>
}
