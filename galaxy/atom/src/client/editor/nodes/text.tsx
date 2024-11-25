import React, { CSSProperties } from 'react'
import { SFText } from './node'

export const TextName = 'text'

export function NewTextNode (text: string): SFText {
  const node = { name: TextName, text: text }
  return node
}

export function SFTextView (props: {attributes: any, children: any, node: SFText}) {
  const style: CSSProperties = {}
  let className: string = ''
  console.debug('SFTextView', props.node)

  for (const key in props.node) {
    // if (!Object.prototype.hasOwnProperty.call(props, key)) {
    //   continue
    // }
    switch (key) {
      case 'bold':
        style.fontWeight = 'bold'
        break
      case 'italic':
        style.fontStyle = 'italic'
        break
      case 'underline':
        style.textDecoration = 'underline'
        break
      case 'strike':
        style.textDecoration = 'line-through'
        break
      case 'code':
        className = 'inline-code'
        break
    }
  }
  return <span data-name={TextName} {...props.attributes}
                className={className}
               style={style}>{props.children}</span>
}
