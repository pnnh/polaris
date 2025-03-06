import React from 'react'
import './page.scss'
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import ContentLayout from "@/components/server/content/layout";
import {getPathname} from "@/services/server/pathname";
import RandomPasswordPage from "@/atom/client/components/tools/password/random-password";
import {CommentsClient} from "@/atom/client/components/comments/comments";

export const metadata: Metadata = {
    title: pageTitle('随机密码生成器'),
    description: `方便的生成随机密码或是随机字符串，支持自定义密码长度、密码字符集、密码个数等。`,
    keywords: `随机密码,密码生成器,密码工具,密码生成,密码`
};

export default async function Home({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    return <ContentLayout lang={'zh'} searchParams={await searchParams} pathname={pathname}
                          metadata={metadata}>
        <div className={'indexPage'}>
            <RandomPasswordPage/>
            <div className={'commentsClient'}>
                <CommentsClient resource={'c26b810d-92c6-5632-a546-3e509e585b96'}/>
            </div>
        </div>
    </ContentLayout>
}
