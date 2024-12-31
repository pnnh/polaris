
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
