import React from 'react'
import './page.scss'
import RandomPasswordPage from './random-password'
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import ContentLayout from "@/components/server/content/layout";
import {BaseRouterParams} from "@/models/server/router";
import {getPathname} from "@/services/server/pathname";
import {useServerTranslation} from "@/services/server/i18n";

export const metadata: Metadata = {
    title: pageTitle('随机密码生成器'),
    description: `方便的生成随机密码或是随机字符串，支持自定义密码长度、密码字符集、密码个数等。`,
    keywords: `随机密码,密码生成器,密码工具,密码生成,密码`
};

export default async function Home({params, searchParams}: {
    params: Promise<{ channel: string } & BaseRouterParams>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const searchParamsValue = await searchParams
    const {t: trans} = await useServerTranslation(baseParams.lang)
    const metadata: Metadata = {
        title: trans('codegen.seo.title'),
        keywords: trans('codegen.seo.keywords'),
        description: trans('codegen.seo.description'),
    }
    return <ContentLayout lang={baseParams.lang} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata} params={baseParams}>
        <div className={'indexPage'}>
        <RandomPasswordPage/>
    </div>
    </ContentLayout>
}
