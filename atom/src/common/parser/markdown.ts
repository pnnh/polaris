import {marked, Token} from 'marked'
import {CodeBlockNode, HeadingNode, ImageNode, LinkNode, ListNode, SteleBody, SteleNode} from '@/common/models/stele'
import {generatorRandomString} from "@pnnh/atom";

export function tokenToNode(token: Token): SteleNode {
    let children: SteleNode[] | undefined
    const assertToken = token as { tokens: Token[] }
    if (typeof assertToken.tokens !== 'undefined' && Array.isArray(assertToken.tokens) &&
        assertToken.tokens.length > 0) {
        children = assertToken.tokens.map((t: Token) => tokenToNode(t))
    }

    let node: SteleNode
    switch (token.type) {
        case 'heading':
            node = {
                id: generatorRandomString(8),
                name: 'header',
                header: token.depth,
                text: 'text' in token ? token.text : '',
                raw: token.raw,
                children
            } as HeadingNode
            break
        case 'code':
            node = {
                id: generatorRandomString(8),
                name: 'code-block',
                language: token.lang,
                text: 'text' in token ? token.text : '',
                raw: token.raw,
                children
            } as CodeBlockNode
            break
        case 'image':
            node = {
                id: generatorRandomString(8),
                name: 'image',
                text: 'text' in token ? token.text : '',
                raw: token.raw,
                href: token.href,
                children
            } as ImageNode
            break
        case 'list':
            node = {
                id: generatorRandomString(8),
                name: 'list',
                text: 'text' in token ? token.text : '',
                raw: token.raw,
                ordered: token.ordered,
                start: token.start,
                loose: token.loose,
                children
            } as ListNode
            break
        case 'link':
            node = {
                id: generatorRandomString(8),
                name: 'link',
                text: 'text' in token ? token.text : '',
                raw: token.raw,
                href: token.href,
                children
            } as LinkNode
            break
        default:
            node = {
                id: generatorRandomString(8),
                name: token.type,
                text: 'text' in token ? token.text : '',
                raw: token.raw,
                children
            }
    }

    // 针对容器类型的元素，解析其子元素
    const containerToken = token as { tokens: Token[] }
    if (Array.isArray(containerToken.tokens)) {
        node.children = containerToken.tokens.map((t: Token) => tokenToNode(t))
    }

    // 针对list类型的特殊处理
    const listToken = token as { items: Token[] }
    if (Array.isArray(listToken.items)) {
        node.children = listToken.items.map((t: Token) => tokenToNode(t))
    }
    return node
}

export function markdownToStele(markdown: string) {
    const body: SteleBody = {
        id: generatorRandomString(8),
        name: 'body', children: [], text: '', raw: ''
    }
    const tokens = marked.lexer(markdown)
    body.children = tokens.map((t: Token) => tokenToNode(t))
    return body
}
