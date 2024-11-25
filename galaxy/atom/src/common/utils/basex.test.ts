import {base58ToString, stringToBase58} from "./basex";
import {describe} from "@jest/globals";
import {TextEncoder, TextDecoder} from 'util';

// 避免jest提示TextEncoder未定义
Object.assign(global, {TextDecoder, TextEncoder});

const rawText = 'anonymous@system'
const encodedText = 'DpFauiFYHooGwi9QD2N6VW'

describe('stringToBase58', () => {
    test('renders a heading', () => {
        const encoded = stringToBase58(rawText)
        expect(encoded).toBe(encodedText)
    })
})

describe('base58ToString', () => {
    test('renders a heading', () => {
        const decoded = base58ToString(encodedText)
        expect(decoded).toBe(rawText)
    })
})
