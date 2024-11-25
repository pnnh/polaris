import React, {KeyboardEvent} from 'react'
import {SFText} from './node'
import {ReactEditor, useSlate} from 'slate-react'
import {
    BaseEditor,
    Editor,
    Element as SlateElement,
    Node as SlateNode,
    Range as SlateRange,
    Transforms
} from 'slate'
import {NewTextNode, TextName} from './text'
import isHotkey from 'is-hotkey'
import {selectNodeLast} from '../helpers'
import './paragraph.scss'
import {DOMEditor} from "slate-dom";

export const ParagraphName = 'paragraph'

export function SFParagraphToolbar(props: { disabled: boolean, node: SFParagraphNode }) {
    const editor = useSlate()
    const paragraph = NewParagraphNode('')
    const className = 'icon-button size-normal' + (isParagraphBlockActive(editor, isActive) ? ' active' : '')

    return <>
        <button title='段落' className={className}
                disabled={props.disabled}
                onMouseDown={(event: React.MouseEvent) => {
                    console.debug('SFParagraphToolbar onClick')
                    event.preventDefault()

                    selectNodeLast(editor as DOMEditor, props.node)
                    Transforms.insertNodes(
                        editor,
                        paragraph
                    )
                }}><i className="ri-paragraph"></i></button>
    </>
}

export function SFParagraphActions(props: { node: SFParagraphNode }) {
    const editor = useSlate() as ReactEditor
    return <>
        <SFIcon iconName={'ri-bold'} format={'bold'} node={props.node}/>
        <SFIcon iconName={'ri-italic'} format={'italic'} node={props.node}/>
        <SFIcon iconName={'ri-underline'} format={'underline'} node={props.node}/>
        <SFIcon iconName={'ri-strikethrough'} format={'strike'} node={props.node}/>
        <SFIcon iconName={'ri-code-line'} format={'code'} node={props.node}/>
        <button title='清除格式' className={'icon-button'}
                onMouseDown={useClearFormats(editor, props.node)}>
            <i className="ri-format-clear"></i></button>
    </>
}

export interface SFParagraphNode extends SlateElement {
    name: string;
    children: SFText[];
}

export function NewParagraphNode(text: string): SFParagraphNode {
    return {
        name: ParagraphName,
        children: [NewTextNode(text)]
    }
}

function isActive(props: any): boolean {
    const node = props as SFParagraphNode
    return node.name === 'paragraph'
}


export function SFParagraphView(props: { attributes: any, children: any, node: SFParagraphNode }) {
    return <div className={'styleParagraph'}>
        <p data-name={ParagraphName} {...props.attributes}>{props.children}</p>
    </div>
}

export function ParagraphOnKeyDown(editor: BaseEditor, event: KeyboardEvent<HTMLParagraphElement>) {
    if (isHotkey('mod+b', event)) {
        console.debug('加粗')
        Editor.addMark(editor, 'bold', true)
    } else if (isHotkey('mod+i', event)) {
        console.debug('斜体')
        Editor.addMark(editor, 'italic', true)
    } else if (isHotkey('mod+u', event)) {
        console.debug('下划线')
        Editor.addMark(editor, 'underline', true)
    } else if (isHotkey('mod+c', event)) {
        console.debug('行内代码')
        Editor.addMark(editor, 'code', true)
    }
}

function useClearFormats(editor: BaseEditor, node: SFParagraphNode) {
    let text = ''
    for (const i in node.children) {
        text += (node.children[i] as { text: string }).text
    }
    return () => {
        const nodePath = ReactEditor.findPath(editor as DOMEditor, node)
        Transforms.select(editor, nodePath)
        console.debug('useClearFormats', text)
        const paragraph = NewParagraphNode(text)
        Transforms.removeNodes(editor)
        Transforms.insertNodes(editor, paragraph)
    }
}

export function isParagraphBlockActive(editor: BaseEditor, isActive: (node: any) => boolean): boolean {
    const [match] = Editor.nodes(editor, {
        match: (n: SlateNode) => {
            return !Editor.isEditor(n) && SlateElement.isElement(n) && isActive(n)
        }
    })
    return !!match
}

function calcSelection(editor: BaseEditor, node: SlateNode) {
    const selection = editor.selection
    console.debug('toggleMark-selection', selection)
    const [firstNode, firstPath] = SlateNode.first(node, [])
    const [lastNode, lastPath] = SlateNode.last(node, [])
    console.debug('toggleMark-first', firstNode, firstPath, lastNode, lastPath)
    const nodePath = ReactEditor.findPath(editor as DOMEditor, node)
    console.debug('toggleMark-nodePath', nodePath)
    if (selection) {
        const parent1 = SlateNode.parent(editor, selection.anchor.path)
        const parent2 = SlateNode.parent(editor, selection.focus.path)
        console.debug('toggleMark-parent', parent1, parent2)
        const nodeRange: SlateRange = {
            anchor: {
                path: nodePath.concat(firstPath), offset: 0
            },
            focus: {
                path: nodePath.concat(lastPath), offset: SlateNode.string(lastNode).length
            }
        }
        const selectRange: SlateRange = {
            anchor: selection.anchor, focus: selection.focus
        }
        const intersection = SlateRange.intersection(selectRange, nodeRange)
        console.debug('toggleMark-intersection', intersection)
        return intersection
    }
}

function SFIcon(props: { iconName: string, format: string, node: SFParagraphNode }) {
    const editor = useSlate()
    const isMarkActive = (editor: BaseEditor, isActive: (node: any) => boolean): boolean => {
        const marks = Editor.marks(editor) as any
        if (!marks) {
            return false
        }
        if (!marks || marks.name !== TextName) {
            return false
        }
        for (const key in marks) {
            if (key === props.format && typeof marks[key] === 'boolean') {
                return Boolean(marks[key])
            }
        }
        return false
    }
    const className = 'icon-button size-normal' + (isMarkActive(editor, isActive) ? ' active' : '')
    return <button title='段落' className={className}
                   onMouseDown={(event) => {
                       event.preventDefault()

                       const selection = calcSelection(editor, props.node)
                       if (selection) {
                           Transforms.select(editor, selection)
                           console.debug('toggleMark-toggleMark', isMarkActive(editor, isActive))
                           if (isMarkActive(editor, isActive)) {
                               Editor.removeMark(editor, props.format)
                           } else {
                               Editor.addMark(editor, props.format, true)
                           }
                       }
                   }}><i className={props.iconName}></i></button>
}
