// export interface HeadingNode {
//     name: string
//     header: number
//     children: TextNode[]
// }

export interface TextNode {
    name: string
    text: string
}

// export interface ParagraphNode {
//     name: string
//     children: TextNode[]
// }
//
// export interface CodeBlockNode {
//     name: string
//     language: string
//     children: TextNode[]
// }

//export type SteleNode = HeadingNode | ParagraphNode | CodeBlockNode;

export interface SteleBody {
    name: string
    children: SteleNode[]
}



export interface SteleNode {
    id: string;
    name: string;
    text: string;
    raw: string;
    children?: SteleNode[];
}

export interface HeadingNode extends SteleNode {
    header: number;
}

export interface ParagraphNode extends SteleNode {
}

export interface CodeBlockNode extends SteleNode {
    language: string;
}

export interface ListNode extends SteleNode {
    ordered: boolean;
    start: number;
    loose: boolean;
}

export interface LinkNode extends SteleNode {
    href: string;
}

export interface ImageNode extends SteleNode {
    href: string;
}

export interface SteleBody extends SteleNode {
}

export function buildText(node: SteleNode) {
    const text = node.text as string
    return text
}
