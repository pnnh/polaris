import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {mustBase58ToUuid, tryBase58ToUuid} from "@/atom/common/utils/basex";
import {useServerConfig} from "@/components/server/config";
import {langZh} from "@/atom/common/language";
import {ConsoleArticleForm} from "./form";
import {PSArticleModel} from "@/components/common/models/article";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import {GlobalLayout} from "@/components/server/global";
import {css} from '@emotion/css'
import {transText} from "@/components/common/locales/normal";
import {CommunityArticleNodeService} from "@/components/community/articles";
import {Request, Response} from "express";

const styles = {
    articlesPage: css`
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
    `,
    pageContainer: css``
};

export const dynamic = "force-dynamic";

export async function Home(request: Request, response: Response) {

    const pageLang = request.params.lang || langZh
    const metadata = new PageMetadata(pageLang)
    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const articleUid = tryBase58ToUuid(request.params.uid)
    const isNew = articleUid === EmptyUUID;
    let model: PSArticleModel | undefined = undefined;
    const wantLang = request.query.wantLang || pageLang;
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
            lang: wantLang as string,
            create_time: '',
            update_time: ''
        }
        if (copyFrom) {
            const copyFromUid = mustBase58ToUuid(copyFrom as string);
            const query = {
                action: 'get',
                keyword: copyFromUid
            }
            const queryResult = await CommunityArticleNodeService.consoleQueryArticles(internalPortalUrl, pageLang, query)
            if (!queryResult || queryResult.range.length === 0) {
                throw new Error(transText(pageLang, '无法找到要复制的文章', 'Cannot find the article to copy'));
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
            ;
            throw new Error(transText(pageLang, '无效的文章标识', 'Invalid article identifier'));
        }
        const query = {
            action: 'get',
            keyword: articleUid
        }
        const queryResult = await CommunityArticleNodeService.consoleQueryArticles(internalPortalUrl, pageLang, query)
        if (!queryResult || queryResult.range.length === 0) {

            throw new Error(transText(pageLang, '无法找到指定的文章', 'Cannot find the specified article'));
        }
        model = queryResult.range[0];
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
            <div className={styles.pageContainer}>
                <ConsoleArticleForm publicPortalUrl={publicPortalUrl} modelString={modelString} lang={pageLang}/>
            </div>
        </div>
    </GlobalLayout>
}
