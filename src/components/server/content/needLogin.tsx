import styles from "@/components/server/console/layout.module.scss";
import GlobalLayout from "@/components/server/global";
import React from "react";
import {PageMetadata, pageTitle} from "@/utils/page";
import {transText} from "@/services/common/locales/normal";

export function NeedLoginPage({lang}: { lang: string }) {
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, transText(lang, 'NeedLogin'));
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.consolePage}>
            {transText(lang, 'NeedLogin')}
        </div>
    </GlobalLayout>
}
