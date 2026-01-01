import React from "react";

import {generateUuidV7, stringToMd5} from "@pnnh/atom";
import {isValidUUID} from "@pnnh/atom";
import {StyleTag} from "@/components/client/style";

export function css(text: TemplateStringsArray, ...values: any[]) {
    let str = '';
    text.forEach((string, i) => {
        str += string + (values[i] || '');
    });
    return new StyleItem(str);
}

export class StyleItem {
    private readonly text: string;
    private readonly class: string;

    constructor(text: string) {
        this.text = text;
        this.class = 'atom-' + stringToMd5(text).slice(0, 8);
    }

    get className() {
        return this.class
    }

    get contentText() {
        return this.text;
    }
}


export function html(text: TemplateStringsArray, ...values: any[]) {
    let str = '';
    text.forEach((string, i) => {
        str += string + (values[i] || '');
    });
    return str;
}

export interface PSComponentLayoutProps {
    lang: string;
    inlineStyle?: boolean;
    comId?: string;
    styleItems?: StyleItem | StyleItem[] | undefined;
}

export function PSComponentLayout({
                                      children,
                                      lang,
                                      styleItems,
                                      comId, inlineStyle
                                  }: {
    children: React.ReactNode,
    lang: string,
    styleItems?: StyleItem | StyleItem[] | undefined,
    comId?: string
    inlineStyle?: boolean
}) {
    if (!comId) {
        comId = generateUuidV7();
    } else if (!isValidUUID(comId)) {
        throw new Error('Invalid comId provided to PSComponentLayout');
    }
    comId = comId.slice(0, 8); // Ensure comId is a short version
    let styleText: string = '';
    if (Array.isArray(styleItems)) {
        styleItems.forEach((item) => {
            styleText += `.${item.className}{${item.contentText}}\n`;
        });
    } else if (styleItems instanceof StyleItem) {
        styleText = `.${styleItems.className}{${styleItems.contentText}}`;
    }
    return <>
        <StyleTag comId={comId} styleText={styleText} inline={inlineStyle || false}/>
        {children}
    </>
}
