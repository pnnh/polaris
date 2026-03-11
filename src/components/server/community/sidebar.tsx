'use client';

import React from "react";
import {transKey, transTodo} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";

export function CommunitySidebar({lang}: { lang: string }) {
    return <div className={sidebarStyles.communitySidebar}>
        <a href={`/${lang}`}>{transKey(lang, "common.home")}</a>
        <a href={`/${lang}/community/userinfo`}>
            {transKey(lang, "common.userInfo")}
        </a>
        <a href={`/${lang}/community/files`}>
            {transTodo("文件")}
        </a>
        <a href={`/${lang}/community/articles`}>
            {transTodo("文章")}
        </a>
        <a href={`/${lang}/community/channels`}>
            {transTodo("频道")}
        </a>
        <a href={`/${lang}/community/photos`}>
            {transTodo("图片")}
        </a>
    </div>
}

const sidebarStyles = {
    communitySidebar: css`
        display: flex;
        flex-direction: column;
        background: var(--background-color);
        width: 16rem;
        border-right: solid 1px #E0E0E0;
        flex-shrink: 0;

        & a {
            text-decoration: none;
            color: var(--text-primary-color);
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border-bottom: solid 1px #E0E0E0;
        }

        & a:hover {
            background-color: var(--action-hover-color);
        }

        & a.active {
            background-color: #E0E0E0;
            font-weight: bold;
        }
    `
}
