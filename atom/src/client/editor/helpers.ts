import {ReactEditor} from 'slate-react'
import {BaseEditor, Editor as SlateEditor, Node as SlateNode, Transforms} from 'slate'
import {DOMEditor} from "slate-dom";

export function selectNodeLast(editor: BaseEditor, node: SlateNode) {
    const nodePath = ReactEditor.findPath(editor as DOMEditor, node)
    const [lastNode, lastPath] = SlateNode.last(node, [])
    const point = {
        path: nodePath.concat(lastPath), offset: SlateNode.string(lastNode).length
    }
    Transforms.select(editor, point)
}
