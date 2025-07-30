'use client';
import styles from './sidebar.module.scss';

import React from "react";
import {localText} from "@/atom/common/language";

export function ConsoleSidebar({lang}: { lang: string }) {
    return <div className={styles.consoleSidebar}>
        <a href={`/${lang}`}>{localText(lang, '首页', 'Home')}</a>
        <a href={`/${lang}/account/userinfo`}>
            {localText(lang, '个人信息', 'User Info')}
        </a>
        <a href={`/${lang}/console/articles`}>
            {localText(lang, '笔记', 'Articles')}
        </a>
        <a href={`/${lang}/console/channels`}>
            {localText(lang, '频道', 'Channels')}
        </a>
    </div>
}
