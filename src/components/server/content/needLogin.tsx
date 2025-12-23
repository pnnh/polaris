import React from "react";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {transKey} from "@/components/common/locales/normal";

export function NeedLoginPage({lang}: { lang: string }) {
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, transKey(lang, 'NeedLogin'));
    return <div>
        {transKey(lang, 'NeedLogin')}
    </div>
}
