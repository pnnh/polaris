import React from "react";

import {generateUuidV7, stringToMd5} from "@/atom/common/utils/basex";
import {isValidUUID} from "@/atom/common/utils/uuid";

export function css(text: TemplateStringsArray, ...values: any[]) {
    let str = '';
    text.forEach((string, i) => {
        str += string + (values[i] || '');
    });
    return new StyleItem(str);
}

export class ServerStyleCollector {
    private styleItems: StyleItem[];

    constructor() {
        this.styleItems = [];
    }

    push(item: StyleItem) {
        this.styleItems.push(item);
    }

    getStyles() {
        return this.styleItems;
    }
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

export function ServerComponentStyle({
                                         styleItems,
                                         comId
                                     }: {
    styleItems?: StyleItem | StyleItem[] | undefined,
    comId?: string
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
    return <ServerStyleTag comId={comId} styleText={styleText}/>
}


export function ServerStyleTag({comId, styleText}: { comId: string, styleText: string }) {
    const styleId = `style-${comId}`;
    return (
        styleText ? <style id={styleId}>{styleText}</style> : null
    );
}
