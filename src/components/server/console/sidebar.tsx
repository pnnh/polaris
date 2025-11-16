'use client';
import styles from './sidebar.module.scss';

import React from "react";
import {transText} from "@/components/common/locales/normal";

export function ConsoleSidebar({lang}: { lang: string }) {
    return <div className={styles.consoleSidebar}>
        <a href={`/${lang}`}>{transText(lang, '首页', 'Home')}</a>
        <a href={`/${lang}/console/userinfo`}>
            {transText(lang, '个人信息', 'User Info')}
        </a>
        <a href={`/${lang}/console/articles`}>
            {transText(lang, '笔记', 'Articles')}
        </a>
        <a href={`/${lang}/console/channels`}>
            {transText(lang, '频道', 'Channels')}
        </a>
    </div>
}
