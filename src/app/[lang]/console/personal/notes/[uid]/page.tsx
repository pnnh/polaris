import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {mustBase58ToUuid, tryBase58ToUuid, uuidToBase58} from "@/atom/common/utils/basex";
import {useServerConfig} from "@/components/server/config";
import {langZh, localText} from "@/atom/common/language";
import {notFound, redirect} from "next/navigation";
import {ConsoleArticleForm} from "./form";
import {serverConsoleGetArticle} from "@/components/server/articles/articles";
import {PSArticleModel} from "@/photon/common/models/article";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import GlobalLayout from "@/components/server/global";
import styles from './page.module.scss'

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
    return <GlobalLayout lang={pageLang} metadata={metadata}>
        <div className={styles.articlesPage}>
            <div className={styles.pageContainer}>
                <ConsoleArticleForm portalUrl={portalUrl} modelString={modelString} lang={pageLang}
                                    copyFrom={copyFrom}/>

            </div>

        </div>
    </GlobalLayout>
}
