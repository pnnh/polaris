import {stringToMd5} from "@/utils/basex";

export function GlobalStyleTag() {
    const rawStyle = styleGroup.renderToString();
    let outputStyle = rawStyle;
    return <style>
        {outputStyle}
    </style>
}

export class StyleObject {
    #styleName: string = '';
    #styleText: string

    constructor(text: string) {
        this.#styleText = text;
    }

    set setClassName(name: string) {
        this.#styleName = name;
    }

    get className() {
        return this.#styleName;
    }

    get styleText() {
        return this.#styleText;
    }
}

class StyleGroup {
    styles: { [key: string]: StyleObject }[] = [];

    create(styles: { [key: string]: StyleObject }) {
        this.styles.push(styles);
        for (const key in styles) {
            const styleText = styles[key].styleText;
            const suffix = stringToMd5(styleText).slice(0, 8);
            styles[key].setClassName = `pls-${key}-${suffix}`;
        }
        return styles
    }

    renderToString() {
        let str = '';
        this.styles.forEach((style) => {
            Object.keys(style).forEach((key) => {
                str += `.${style[key].className} {${style[key].styleText}}\n`
            })
        })
        return str;
    }
}

export const styleGroup = new StyleGroup();


export function css(text: TemplateStringsArray, ...values: any[]) {
    let str = '';
    text.forEach((string, i) => {
        str += string + (values[i] || '');
    });
    return new StyleObject(str);
}
