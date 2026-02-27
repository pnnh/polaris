'use client';

import React from "react";
import {css} from "@/gen/styled/css";

export function ConsoleImageSidebar({lang}: { lang: string }) {
    return <div className={sidebarStyles.consoleSidebar}>
        <a href={`/${lang}/console/personal/images`}>
            {'图片'}
        </a>
    </div>
}

const sidebarStyles = {
    consoleSidebar: css`
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
