'use client';
import styles from './sidebar.module.scss';

import React from "react";

export function ConsoleSidebar({lang}: { lang: string }) {
    return <div className={styles.consoleSidebar}>
        <a href={`/${lang}`}>首页</a>
        <a href={`/${lang}/account/userinfo`}>
            用户资料
        </a>
        <a href={`/${lang}/console/articles`}>文章</a>
        <a href={`/${lang}/console/channels`}>频道</a>
    </div>
}
