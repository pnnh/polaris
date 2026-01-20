'use client';

import React from "react";
import {transText} from "@/components/common/locales/normal";

export function ConsoleSidebar({lang}: { lang: string }) {
    return <div className="consoleSidebar">
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

        <style jsx>{`
            .consoleSidebar {
                display: flex;
                flex-direction: column;
                background: var(--background-color);
                width: 16rem;
                border-right: solid 1px #E0E0E0;
                flex-shrink: 0;
            }

            .consoleSidebar :global(a) {
                text-decoration: none;
                color: var(--text-primary-color);
                padding: 0.5rem 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                border-bottom: solid 1px #E0E0E0;
            }

            .consoleSidebar :global(a:hover) {
                background-color: var(--action-hover-color);
            }

            .consoleSidebar :global(a.active) {
                background-color: #E0E0E0;
                font-weight: bold;
            }
        `}</style>
    </div>
}
