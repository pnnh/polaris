import {ReactEditor} from 'slate-react'
import {Editor as SlateEditor, Node as SlateNode, Transforms} from 'slate'

export function selectNodeLast(editor: ReactEditor, node: SlateNode) {
    const nodePath = ReactEditor.findPath(editor, node)
    const [lastNode, lastPath] = SlateNode.last(node, [])
    const point = {
        path: nodePath.concat(lastPath), offset: SlateNode.string(lastNode).length
    }
    Transforms.select(editor, point)
}
