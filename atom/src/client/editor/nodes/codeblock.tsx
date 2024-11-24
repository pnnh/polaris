import React, {useState} from 'react'
import {SFElement} from './node'
import {ReactEditor, useSlate} from 'slate-react'
import {
    Editor,
    Element as SlateElement,
    Node as SlateNode,
    Path as SlatePath,
    Text as SlateText,
    Transforms
} from 'slate'
import {selectNodeLast} from '../helpers'
import {css} from "@emotion/css";

export const CodeBlockName = 'code-block'
export const CodeName = 'code'

export interface SFCodeBlockNode extends SlateElement {
    name: string;
    children: SFCode[];
    language: string;
}

export interface SFCode extends SlateText {
    name: string
}

export function NewCodeNode(text: string): SFCode {
    return {name: CodeName, text: text}
}

export function NewCodeBlockNode(language: string, text: string): SFCodeBlockNode {
    const block: SFCodeBlockNode = {
        name: CodeBlockName, children: [], language: language
    }
    const codeNode: SFCode = NewCodeNode(text)
    block.children.push(codeNode)
    return block
}

const styles = {
    codeBlock: css`
        background: #f6f6f6;
        border-radius: 4px;
        padding: 8px;
        margin: 8px 0;
        line-height: 24px;
    `,
    selectLanguage: css`
        float: right;
        position: relative;
        top: 4px;
    `
}

export function SFCodeBlockView(props: { attributes: any, children: any, node: SFCodeBlockNode }) {

    return <pre data-name={CodeBlockName} className={styles.codeBlock}
                {...props.attributes}>
            <SelectLanguage element={props.node}/>
        {props.children}
        </pre>
}

export function isCodeBlockActive(editor: ReactEditor, isActive: (node: any) => boolean): boolean {
    const [match] = Editor.nodes(editor, {
        match: (n: SlateNode) => {
            return !Editor.isEditor(n) && SlateElement.isElement(n) && isActive(n)
        }
    })
    return !!match
}

function isActive(props: any): boolean {
    const node = props as SFElement
    return node.name === CodeBlockName
}

export function SFCodeBlockLeafView(props: { attributes: any, children: any, node: any }) {
    let className = 'token '
    for (const k in props.node) {
        if (k === 'name' || k === 'text') continue
        className += (k + ' ')
    }
    className = className.trim()
    return <span data-name={CodeName}
                 {...props.attributes}
                 className={className}>
      {props.children}
    </span>
}

export function SFCodeBlockToolbar(props: { node: SlateNode }) {
    const editor = useSlate() as ReactEditor
    const node = NewCodeBlockNode('js', '')
    const className = 'icon-button' + (isCodeBlockActive(editor, isActive) ? ' active' : '')
    return <button title='段落' className={className}
                   onMouseDown={(event) => {
                       event.preventDefault()

                       selectNodeLast(editor, props.node)
                       Transforms.insertNodes(
                           editor,
                           // [node, paragraphNode]    // 同时插入一个段落
                           [node]
                       )
                   }}><i className={'ri-terminal-box-line'}></i></button>
}

function SelectLanguage(props: { element: SFCodeBlockNode }) {
    const editor = useSlate() as ReactEditor
    const [language, setLanguage] = useState<string>(props.element.language)
    return <select name="select" value={language} className={styles.selectLanguage}
                   onChange={(event) => {
                       console.debug('Select Language', editor, event)
                       if (event.target.value) {
                           const selection = editor.selection
                           if (!selection) {
                               return
                           }
                           const parentPath = SlatePath.parent(selection.focus.path)
                           console.debug('Select Language2', parentPath)

                           selectNodeLast(editor, props.element)
                           const newCodeblockNode: SFCodeBlockNode = {
                               name: CodeBlockName,
                               children: props.element.children,
                               language: event.target.value
                           }
                           Transforms.setNodes(editor, newCodeblockNode)
                           setLanguage(event.target.value)
                       }
                   }}>
        <option value="bash">Bash</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="csharp">C#</option>
        <option value="css">CSS</option>
        <option value="dart">Dart</option>
        <option value="go">Go</option>
        <option value="html">HTML</option>
        <option value="js">JavaScript</option>
        <option value="json">JSON</option>
        <option value="java">Java</option>
        <option value="kotlin">Kotlin</option>
        <option value="lisp">Lisp</option>
        <option value="markdown">Markdown</option>
        <option value="python">Python</option>
        <option value="php">PHP</option>
        <option value="rust">Rust</option>
        <option value="sql">SQL</option>
        <option value="swift">Swift</option>
    </select>
}
