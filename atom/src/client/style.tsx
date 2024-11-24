import React from 'react'
import {css} from "@emotion/react";

const styleText = css`
    .headerOne {
        margin: 0 0 1.3rem;
        font-weight: 600;
        color: red;
        font-size: 24px;
        line-height: 34px;
        padding-bottom: 12px;
    }

    .headerTwo {
        margin: 0 0 1.3rem;
        font-weight: 600;
        color: #252933;
        font-size: 22px;
        line-height: 34px;
        padding-bottom: 12px;
    }

    .headerThree {
        margin: 0 0 1.3rem;
        font-weight: 600;
        color: #252933;
        font-size: 20px;
        line-height: 34px;
        padding-bottom: 12px;
    }

    .headerFour {
        margin: 0 0 1.3rem;
        font-weight: 600;
        color: #252933;
        font-size: 18px;
        line-height: 34px;
        padding-bottom: 12px;
    }

    .headerFive {
        margin: 0 0 1.3rem;
        font-weight: 600;
        color: #252933;
        font-size: 16px;
        line-height: 34px;
        padding-bottom: 12px;
    }

    .headerSix {
        margin: 0 0 1.3rem;
        font-weight: 600;
        color: #252933;
        font-size: 14px;
        line-height: 34px;
        padding-bottom: 12px;
    }

    .codeblock {
        font-size: 14px;
        line-height: 1.6;
    }

    .codeblock pre {
        margin: 1rem 0;
        background-color: #fafafa;
        padding: 8px;
        border-radius: 4px;
        white-space: break-spaces;
        overflow: auto;
    }

    .paragraph {
        font-weight: 400;
        font-size: 15px;
        line-height: 1.8;
        word-break: break-word;
        margin: 1rem 0;
    }

    .paragraph .link {
        color: #3380df;
        text-decoration: none;
    }

    .paragraph .strong {
        font-weight: 600;
    }

    .paragraph .underline {
        text-decoration: underline;
    }

    .paragraph .strikethrough {
        text-decoration: line-through;
    }

    .paragraph .italic {
        font-style: italic;
    }

    .stImg {
        max-width: 100%;
    }
`

export function ArticleStyle() {
    const rawStyle = styleText.styles;
    const outputStyle = rawStyle.replace(/\n/g, '');
    return <style>
        {outputStyle}
    </style>
}
