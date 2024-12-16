import theme from './theme';
import {ThemeProvider} from "@mui/material";
import './i18n/i18n';

import RandomPasswordPage from "@/tools/password/random-password.tsx";
import {css} from "@emotion/css";

const styleFullPage = css`
    background-color: #f3f3f3;
`

const styleMainContainer = css`
    width: 100%;
    height: 100%;
    background-color: #ffffff;
`

export function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className={styleFullPage}>
                <div className={styleMainContainer}>
                    <RandomPasswordPage/>
                </div>
            </div>
        </ThemeProvider>
    )
}
