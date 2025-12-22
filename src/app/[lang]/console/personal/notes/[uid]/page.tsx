import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {mustBase58ToUuid, tryBase58ToUuid, uuidToBase58} from "@/atom/common/utils/basex";
import {useServerConfig} from "@/components/server/config";
import {langZh} from "@/atom/common/language";
import {ConsoleArticleForm} from "./form";
import {serverConsoleGetArticle} from "@/components/personal/articles";
import {PSArticleModel} from "@/components/common/models/article";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import {GlobalLayout} from "@/components/server/global";

import {transText} from "@/components/common/locales/normal";
import {css} from "@emotion/css";
import {Request, Response} from "express";

export const dynamic = "force-dynamic";

const styles = {
    articlesPage: css`

        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
    `
}

export async function Home(request: Request, response: Response) {
    const pathname = request.path

    ;
    const pageLang = request.params.lang as string || langZh
    const metadata = new PageMetadata(pageLang)
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const articleUid = tryBase58ToUuid(request.params.uid)
    const isNew = articleUid === EmptyUUID;
    let model: PSArticleModel | undefined = undefined;
    const wantLang = request.query.wantLang as string || pageLang;
    const copyFrom = request.query.copyFrom
    if (isNew) {
        let channelUid = '';
        if (request.query.channel) {
            channelUid = mustBase58ToUuid(request.query.channel as string);
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
        if (copyFrom && model) {
            const copyFromUid = mustBase58ToUuid(copyFrom as string);
            const originModel = await serverConsoleGetArticle(pageLang, internalPortalUrl, copyFromUid)
            if (!originModel) {
                throw new Error(transText(pageLang, '无法找到要复制的文章', 'Cannot find the article to copy'));
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
            ;
            return response.sendStatus(404)
        }
        model = await serverConsoleGetArticle(pageLang, internalPortalUrl, articleUid, wantLang)
        if (!model || !model.uid) {
            if (wantLang) {
                const createUrl = `/${pageLang}/console/articles/${uuidToBase58(EmptyUUID)}?wantLang=${wantLang}&copyFrom=${uuidToBase58(articleUid)}`;
                response.redirect(createUrl)
            } else {
                ;
                return response.sendStatus(404)
            }
            return
        }
        metadata.title = pageTitle(pageLang, model.title)

        metadata.description = model.description
        metadata.keywords = model.keywords

        if (!model.body) {
            return <div>{transText(pageLang, '暂不支持的文章类型', 'Unsupported article type')}</div>
        }
    }
    const modelString = JSON.stringify(model)
    return <GlobalLayout lang={pageLang} metadata={metadata}>
        <div className={styles.articlesPage}>
            <ConsoleArticleForm portalUrl={serverConfig.PUBLIC_PORTAL_URL} modelString={modelString}
                                lang={pageLang}/>

        </div>
    </GlobalLayout>
}
