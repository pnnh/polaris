import React from 'react'
import { Descendant as SlateDescendant, Element as SlateElement, Text as SlateText } from 'slate'

export interface SFEditorModel {
    children: SFDescendant[];
}

export interface SFElement extends SlateElement {
    name: string;
    children: SFDescendant[];
}

export interface SFText extends SlateText {
    name: string
}

export declare type SFDescendant = SFElement | SFText;

export function parseDescendantArray (descendants: SlateDescendant[]): SFDescendant[] {
  return descendants.map(slateDescendant => {
    return parseDescendant(slateDescendant)
  })
}

export function parseDescendant (descendant: SlateDescendant): SFDescendant {
  const d = descendant as any
  if (typeof d.name !== 'string') {
    throw new Error('未知元素: ' + d.name)
  } else {
    return d
  }
}

export function parseElement (descendant: SlateDescendant): SFElement {
  const d = descendant as any
  if (!Array.isArray(d.children)) {
    throw new Error('未知元素: ' + d.name)
  } else {
    return d
  }
}

export function parseText (descendant: SlateDescendant): SFText {
  const d = descendant as any
  if (typeof d.text !== 'string') {
    throw new Error('未知Text节点: ' + d.name)
  } else {
    return d
  }
}

export interface SFPlugin {
    renderToolbox(element: SFElement): JSX.Element
}
