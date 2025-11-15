'use client';
import styles from './sidebar.module.scss';

import React from "react";

export function ConsoleImageSidebar({lang}: { lang: string }) {
    return <div className={styles.consoleSidebar}>
        <a href={`/${lang}/console/personal/images`}>
            {'图片'}
        </a>
    </div>
}
