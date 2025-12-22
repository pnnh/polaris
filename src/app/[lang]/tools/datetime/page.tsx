import React from 'react'
import './page.scss'
import DatetimeComponent from '@/components/client/tools/datetime/datetime';
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/components/common/utils/page";
import {ContentLayout} from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {Request, Response} from "express";

export async function Home(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang || langEn


    const metadata = new PageMetadata(lang)
    return <ContentLayout lang={lang} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={'qrCodePage'}>
            <DatetimeComponent lang={lang}/>
        </div>
    </ContentLayout>
}
