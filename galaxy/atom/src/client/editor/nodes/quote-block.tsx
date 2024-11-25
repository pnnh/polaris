import React, { KeyboardEvent } from 'react'
import { SFText } from './node'
import { ReactEditor, useSlate } from 'slate-react'
import {
  Element as SlateElement,
  Transforms
} from 'slate'
import { NewTextNode, TextName } from './text'
import { selectNodeLast } from '../helpers'
import './quote-block.scss'

export const QuoteBlockName = 'quote-block'

export function SFQuoteBlockToolbar (props: { node: SFQuoteBlockNode }) {
  const editor = useSlate()
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

  return <div className={'style-quote-block'} data-name={QuoteBlockName} {...props.attributes}>
    <blockquote>
      {props.children}
    </blockquote>
  </div>
}
