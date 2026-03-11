import {expect, test} from 'vitest'
import {render} from '@testing-library/react'
import {StyledMenu} from '@/components/client/dropmenu'
import {createTheme, ThemeProvider} from '@mui/material/styles'

const theme = createTheme()

function Wrapper({children}: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

test('StyledMenu snapshot - closed', () => {
    const {container} = render(
        <Wrapper>
            <StyledMenu
                open={false}
                anchorEl={null}
                onClose={() => {
                }}
            >
                <li>Item 1</li>
                <li>Item 2</li>
            </StyledMenu>
        </Wrapper>
    )
    expect(container).toMatchSnapshot()
})

test('StyledMenu snapshot - open with anchor', () => {
    const anchor = document.createElement('button')
    document.body.appendChild(anchor)

    const {container} = render(
        <Wrapper>
            <StyledMenu
                open={true}
                anchorEl={anchor}
                onClose={() => {
                }}
            >
                <li>Item A</li>
                <li>Item B</li>
            </StyledMenu>
        </Wrapper>
    )
    expect(container).toMatchSnapshot()

    document.body.removeChild(anchor)
})
