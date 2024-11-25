'use client'

import React, {ClipboardEvent, useCallback, useMemo, useState} from 'react'
import {Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact} from 'slate-react'
import {
    createEditor,
    Editor as SlateEditor,
    Node as SlateNode,
    NodeEntry,
    Path as SlatePath,
    Range as SlateRange,
    Text,
    Transforms
} from 'slate'
import {HistoryEditor, withHistory} from 'slate-history'
import {HeaderName, SFHeaderActions, SFHeaderNode, SFHeaderToolbar, SFHeaderView} from './nodes/header'
import {NewTextNode, SFTextView} from './nodes/text'
import {
    NewParagraphNode,
    ParagraphName,
    ParagraphOnKeyDown,
    SFParagraphActions,
    SFParagraphNode,
    SFParagraphToolbar,
    SFParagraphView
} from './nodes/paragraph'
import {
    CodeBlockName,
    NewCodeNode,
    SFCode,
    SFCodeBlockLeafView,
    SFCodeBlockNode,
    SFCodeBlockToolbar,
    SFCodeBlockView
} from './nodes/codeblock'
import Prism from 'prismjs'
import './highlight'

import {parseDescendant, parseDescendantArray, parseElement, parseText, SFEditorModel, SFText} from './nodes/node'
import {selectNodeLast} from './helpers'
import {QuoteBlockName, SFQuoteBlockToolbar, SFQuoteBlockView} from './nodes/quote-block'
import './editor.scss'

const StorageKey = 'editor-value'
// 这里是单例的，一个页面只能有一个Editor
let editorObject: ReactEditor & HistoryEditor

export function SFXEditor(props: { value: SFEditorModel, onChange: (value: SFEditorModel) => void }) {
    const renElement = useCallback((props: RenderElementProps) => <Element {...props}/>, [])
    const renLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props}/>, [])
    const editorNode = withHistory(withReact(createEditor() as ReactEditor))
    editorObject = useMemo(() => editorNode, [])
    const decorate = useCallback(decorateElement, [])
    return (
        <Slate editor={editorObject} initialValue={props.value.children}
               onChange={value => {
                   const editorValue = {
                       children: parseDescendantArray(value)
                   }
                   props.onChange(editorValue)
               }}>

            <div className={'stele-editor'}>
                <div className={'body'}>
                    <Editable
                        decorate={decorate}
                        renderElement={renElement}
                        renderLeaf={renLeaf}
                        placeholder="请输入段落"
                        className={'editable'}
                        autoFocus={true}
                        readOnly={false}
                        onKeyDown={onKeyDown}
                        onPaste={onEditorPaste}
                        spellCheck={false}
                    />
                </div>
            </div>
        </Slate>
    )
}

function upOperation(node: SlateNode) {
    const nodePath = ReactEditor.findPath(editorObject, node)
    const prevNodeEntry = SlateEditor.previous(editorObject, {at: nodePath})
    console.log('prevNodeEntry', nodePath, prevNodeEntry)
    if (!prevNodeEntry) {
        return undefined
    }
    downOperation(prevNodeEntry[0])
}

function downOperation(node: SlateNode) {
    const nodePath = ReactEditor.findPath(editorObject, node)
    const nextNodeEntry = SlateEditor.next(editorObject, {at: nodePath})
    console.log('nextNodeEntry', nodePath, nextNodeEntry)
    if (!nextNodeEntry) {
        return
    }
    const nextPath = SlatePath.next(nextNodeEntry[1])
    console.log('nextPath', nextPath)
    Transforms.insertNodes(editorObject, Object.assign({}, node), {
        at: nextPath
    })
    Transforms.removeNodes(editorObject, {at: nodePath})
}

function undoOperation() {
    editorObject.undo()
}

function redoOperation() {
    editorObject.redo()
}

function removeNodes(node: SlateNode) {
    selectNodeLast(editorObject, node)
    Transforms.removeNodes(editorObject)
}

function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    console.debug('selection', editorObject.selection)
    const selection = editorObject.selection
    if (!selection) {
        return
    }
    console.debug('anchor', selection.anchor)
    const selectedElement = SlateNode.descendant(editorObject, selection.anchor.path.slice(0, -1))
    console.debug('selectedElement', selectedElement)
    const selectedLeaf = SlateNode.descendant(editorObject, selection.anchor.path)
    console.debug('selectedLeaf', selectedLeaf)
    const element = parseDescendant(selectedElement)
    const leaf = parseText(selectedLeaf)

    if (event.key === 'Enter') {
        if (element.name === HeaderName) {
            event.preventDefault()
            if (leaf.text.length === selection.anchor.offset) {
                // Transforms.insertNodes(editor, {
                //     type: 'paragraph',
                //     children: [{text: '', marks: []}],
                // });
                console.debug('selectedLeaf2')
                Transforms.insertNodes(editorObject, NewParagraphNode(''))
            }
            // else {
            //     Transforms.splitNodes(editor);
            //     Transforms.setNodes(editor, {type: 'paragraph'});
            // }
        } else if (element.name === CodeBlockName) {
            event.preventDefault()
            console.debug('selectedLeaf3')
            Transforms.insertNodes(editorObject, NewCodeNode('\n'))
        } else if (element.name === ParagraphName) {
            event.preventDefault()
            Transforms.insertNodes(editorObject, NewTextNode('\n'))
        } else if (element.name === QuoteBlockName) {
            event.preventDefault()
            Transforms.insertNodes(editorObject, NewTextNode('\n'))
        }
    } else if (element.name === ParagraphName) {
        ParagraphOnKeyDown(editorObject, event)
    }
}

function onEditorPaste(event: ClipboardEvent<HTMLDivElement>) {
    console.debug('onEditorPaste', event.clipboardData.getData('text'))
    const clipText = event.clipboardData.getData('text')

    console.debug('onEditorPaste2', clipText)
    console.debug('selection', editorObject.selection)
    const selection = editorObject.selection
    if (!selection || !clipText || clipText.length < 1) {
        return
    }
    console.debug('anchor', selection.anchor)
    const selectedElement = SlateNode.descendant(editorObject, selection.anchor.path.slice(0, -1))
    console.debug('selectedElement', selectedElement)
    const selectedLeaf = SlateNode.descendant(editorObject, selection.anchor.path)
    console.debug('selectedLeaf', selectedLeaf)
    const element = parseElement(selectedElement)
    const leaf = parseText(selectedLeaf)
    if (element.name === HeaderName) {
        event.preventDefault()
        if (leaf.text.length > 128) {
            console.debug('标题过长')
            return // 标题过长
        }
        const text = clipText.replaceAll('\n', '')

        console.debug('onEditorPaste selectedLeaf2', text === leaf.text, text, '|', leaf.text, '|')
        const textNode: SFText = NewTextNode(text)
        console.debug('onEditorPaste selectedLeaf3', textNode)
        Transforms.insertNodes(editorObject, textNode)
        // else {
        //     Transforms.splitNodes(editor);
        //     Transforms.setNodes(editor, {type: 'paragraph'});
        // }
    } else if (element.name === CodeBlockName) {
        event.preventDefault()
        const text = clipText
        console.debug('onEditorPaste selectedLeaf3', text === leaf.text, text, '|', leaf.text, '|')
        const codeNode: SFCode = NewCodeNode(text)
        console.debug('onEditorPaste selectedLeaf4', codeNode)
        Transforms.insertNodes(editorObject, codeNode)
    } else if (element.name === ParagraphName) {
        event.preventDefault()
        const textNode: SFText = NewTextNode(clipText)
        console.debug('onEditorPaste ParagraphName222', textNode)
        Transforms.insertNodes(editorObject, textNode)
    } else if (element.name === QuoteBlockName) {
        event.preventDefault()
        const textNode: SFText = NewTextNode(clipText)
        console.debug('onEditorPaste QuoteBlockName', textNode)
        Transforms.insertNodes(editorObject, textNode)
    }
}

const getLength = (token: string | Prism.Token): number => {
    if (typeof token === 'string') {
        return token.length
    } else if (typeof token.content === 'string') {
        return token.content.length
    } else if (Array.isArray(token.content)) {
        console.debug('getLength', typeof token.content, token.content)
        return token.content.reduce((l, t) => l + getLength(t), 0)
    }
    throw new Error('未知token类型')
}

function decorateElement([node, path]: NodeEntry): SlateRange[] {
    console.debug('decorateElement', node, Text.isText(node))

    const ranges: SlateRange[] = []
    if (!Text.isText(node)) {
        return ranges
    }
    // if (editorValue.length > 0) {
    console.debug('decorateElement parent1', editorObject)
    if (editorObject.children.length < 1) {
        return ranges
    }
    const parentNode = SlateNode.parent(editorObject, path) as SFCodeBlockNode
    console.debug('decorateElement parent', parentNode)

    if (!parentNode || parentNode.name !== CodeBlockName) {
        return ranges
    }
    // }
    const tokens = Prism.tokenize(node.text, Prism.languages[parentNode.language])
    let start = 0

    for (const token of tokens) {
        const length = getLength(token)
        const end = start + length
        console.debug('render token ==========', token)
        if (typeof token !== 'string') {
            const range = {
                [token.type]: true,
                anchor: {path, offset: start},
                focus: {path, offset: end}
            }
            if (typeof token.alias === 'string') {
                range[token.alias] = true
            } else if (Array.isArray(token.alias)) {
                for (const k in token.alias) {
                    range[k] = true
                }
            }
            ranges.push(range)
        }

        start = end
    }

    return ranges
}

function Element({attributes, children, element}: { attributes: any, children: any, element: any }) {
    console.debug('renderElement', element, attributes, children)
    const [isActive, setIsActive] = useState<boolean>(false)
    let view: JSX.Element = <span></span>
    let actionsView: JSX.Element = <span></span>
    if (element.name === HeaderName) {
        view = <SFHeaderView attributes={attributes} node={element as SFHeaderNode}>
            {children}
        </SFHeaderView>
        actionsView = <SFHeaderActions/>
    } else if (element.name === CodeBlockName) {
        view = <SFCodeBlockView attributes={attributes} node={element}>{children}</SFCodeBlockView>
    } else if (element.name === QuoteBlockName) {
        view = <SFQuoteBlockView attributes={attributes} node={element}>{children}</SFQuoteBlockView>
    } else {
        view = <SFParagraphView attributes={attributes} node={element as SFParagraphNode}>{children}</SFParagraphView>
        actionsView = <SFParagraphActions node={element as SFParagraphNode}/>
    }
    return <div className={isActive ? 'element-active' : ''}
                onMouseEnter={() => setIsActive(true)}
                onMouseLeave={() => setIsActive(false)}>
        <div className={isActive ? 'actions' : 'actions-invisible'} contentEditable={false}>
            <div className={'left'}>
                <SFParagraphToolbar disabled={false} node={element as SFParagraphNode}/>
                <SFHeaderToolbar node={element}/>
                <SFCodeBlockToolbar node={element}/>
                <SFQuoteBlockToolbar node={element}/>
                <div className={'extra'}>
                    {actionsView}
                </div>
            </div>
            <div>
                <button title='上移' className={'icon-button'}
                        onMouseDown={() => upOperation(element)} disabled={false}>
                    <i className="ri-arrow-up-line"></i></button>
                <button title='下移' className={'icon-button'}
                        onMouseDown={() => downOperation(element)} disabled={false}>
                    <i className="ri-arrow-down-line"></i></button>
                <button title='撤销' className={'icon-button'}
                        onMouseDown={undoOperation} disabled={false}>
                    <i className="ri-arrow-go-back-line"></i></button>
                <button title='重做' className={'icon-button'}
                        onMouseDown={redoOperation} disabled={false}>
                    <i className="ri-arrow-go-forward-line"></i></button>
                <button title='移除块' className={'icon-button'}
                        onMouseDown={() => removeNodes(element)} disabled={false}>
                    <i className="ri-close-line"></i>
                </button>
            </div>
        </div>
        <div>{view}</div>
    </div>
}

function Leaf({attributes, children, leaf}: { attributes: any, children: any, leaf: any }) {
    console.debug('renderLeaf', leaf, attributes, children)
    if (leaf.name === 'text') {
        return <SFTextView attributes={attributes} node={leaf as SFText}>{children}</SFTextView>
    } else if (leaf.name === 'code') {
        return <SFCodeBlockLeafView attributes={attributes} node={leaf}>{children}</SFCodeBlockLeafView>
    }
    return <span {...attributes}>{children}</span>
}
