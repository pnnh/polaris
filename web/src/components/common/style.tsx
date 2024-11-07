import {generatorRandomString} from "@pnnh/atom";

// 只能叫css这个名字，因为IDE会有识别进行语法高亮
export function css(text: TemplateStringsArray, ...values: any[]) {
    let str = '';
    text.forEach((string, i) => {
        str += string + (values[i] || '');
    });
    return new StyleItem(str);
}

export class StyleItem {
    private text: string;
    private class: string;

    constructor(text: string) {
        this.text = text;
        this.class = 'atom-' + generatorRandomString(8)
    }

    get className() {
        return this.class
    }

    get contentText() {
        return this.text;
    }
}
