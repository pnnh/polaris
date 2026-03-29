import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/client/dropmenu'

test('DropdownMenu renders trigger without throwing', () => {
    const { getByText } = render(
        <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Item 1</DropdownMenuItem>
                <DropdownMenuItem>Item 2</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
    expect(getByText('Open')).toBeTruthy()
})

test('DropdownMenu renders items when open', () => {
    const { getByText } = render(
        <DropdownMenu defaultOpen>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Item A</DropdownMenuItem>
                <DropdownMenuItem>Item B</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
    expect(getByText('Item A')).toBeTruthy()
    expect(getByText('Item B')).toBeTruthy()
})
