import {expect, test} from 'vitest'
import {render} from '@testing-library/react'
import {GoTop} from '@/components/client/gotop'

test('GoTop snapshot - hidden by default', () => {
    const {container} = render(<GoTop anchor="main"/>)
    expect(container).toMatchSnapshot()
})

test('GoTop snapshot - with custom anchor', () => {
    const {container} = render(<GoTop anchor="content-area"/>)
    expect(container).toMatchSnapshot()
})
