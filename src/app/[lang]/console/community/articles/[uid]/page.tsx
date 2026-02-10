import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {EmptyUUID, langZh, mustBase58ToUuid, tryBase58ToUuid} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {notFound} from "next/navigation";
import {ConsoleArticleForm} from "./form";
import {PSArticleModel} from "@/components/common/models/article";
import GlobalLayout from "@/components/server/global";
import {css} from "@/gen/styled/css";
import {CommunityArticleNodeService} from "@/components/community/articles";
import {transKey} from "@/components/common/locales/normal";

export const dynamic = "force-dynamic";

const pageStyles = {
    articlesPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
    `,
    pageContainer: css`
    `
}

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, uid: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const paramsValue = await params;
    const searchValue = await searchParams;
    const pageLang = paramsValue.lang || langZh
    const metadata = new PageMetadata(pageLang)
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
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
            const query = {
                action: 'get',
                keyword: copyFromUid
            }
            const queryResult = await CommunityArticleNodeService.consoleQueryArticles(internalPortalUrl, pageLang, query)
            if (!queryResult || queryResult.range.length === 0) {
                throw new Error(transKey(pageLang, "console.article.cannotFindCopy"));
            }
            const originModel = queryResult.range[0];
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
        const query = {
            action: 'get',
            keyword: articleUid
        }
        const queryResult = await CommunityArticleNodeService.consoleQueryArticles(internalPortalUrl, pageLang, query)
        if (!queryResult || queryResult.range.length === 0) {
            notFound()
        }
        model = queryResult.range[0];
        metadata.title = pageTitle(pageLang, model.title)

        metadata.description = model.description
        metadata.keywords = model.keywords

        if (!model.body) {
            return <div>{transKey(pageLang, "console.article.unsupportedType")}</div>
        }
    }
    const modelString = JSON.stringify(model)
    return <GlobalLayout lang={pageLang} metadata={metadata}>
        <div className={pageStyles.articlesPage}>
            <div className={pageStyles.pageContainer}>
                <ConsoleArticleForm publicPortalUrl={publicPortalUrl} modelString={modelString} lang={pageLang}/>
            </div>
        </div>
    </GlobalLayout>
}
