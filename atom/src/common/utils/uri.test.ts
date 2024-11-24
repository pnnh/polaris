import {stringToUri} from "./uri";

describe('stringToUri', () => {
    it('renders a heading', () => {
        const text = 'hello@system'
        const uri = stringToUri(text)
        expect(uri.user).toBe('hello')
        expect(uri.host).toBe('system')
    })
})
