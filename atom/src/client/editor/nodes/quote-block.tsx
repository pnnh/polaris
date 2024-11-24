import React, { KeyboardEvent } from 'react'
import { SFText } from './node'
import { ReactEditor, useSlate } from 'slate-react'
import {
  Element as SlateElement,
  Transforms
} from 'slate'
import { NewTextNode, TextName } from './text'
import { selectNodeLast } from '../helpers'
import {css} from "@emotion/css";

export const QuoteBlockName = 'quote-block'

export function SFQuoteBlockToolbar (props: { node: SFQuoteBlockNode }) {
  const editor = useSlate() as ReactEditor
  const quoteBlock = NewQuoteBlockNode('')
  const className = 'icon-button size-normal'

  return <><button title='引用块' className={className}
                   onMouseDown={(event: React.MouseEvent) => {
                     event.preventDefault()

                     selectNodeLast(editor, props.node)
                     Transforms.insertNodes(
                       editor,
                       quoteBlock
                     )
                   }}><i className="ri-chat-quote-line"></i></button>
  </>
}

export interface SFQuoteBlockNode extends SlateElement {
  name: string;
  children: SFText[];
}

export function NewQuoteBlockNode (text: string): SFQuoteBlockNode {
  return {
    name: QuoteBlockName,
    children: [NewTextNode(text)]
  }
}

export function SFQuoteBlockView (props: { attributes: any, children: any, node: SFQuoteBlockNode }) {
    const styleQuoteBlock = css`
        border-left: 8px solid #dddfe4;
        background: #eef0f4;
        blockquote {
            margin: 0 0 0 16px;
            padding: 8px 0;
        }
    `
  return <div className={styleQuoteBlock} data-name={QuoteBlockName} {...props.attributes}>
    <blockquote>
      {props.children}
    </blockquote>
  </div>
}
