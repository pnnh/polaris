'use client';

import {MenuItem, Select} from "@mui/material";
import {css} from '@emotion/css';

interface ICodeTheme {
    name: string;
    value: string;
    style: string;
    default?: boolean;
}

const codeThemes: ICodeTheme[] = [
    {
        name: 'Default', value: 'prism', style: 'light', default: true
    },
    {
        name: 'Coy', value: 'prism-coy', style: 'light'
    },
    {
        name: 'Okaidia', value: 'prism-okaidia', style: 'dark'
    },
    {
        name: 'Twilight', value: 'prism-twilight', style: 'dark'
    },
    {
        name: 'Funky', value: 'prism-funky', style: 'light'
    },
    {
        name: 'Dark', value: 'prism-dark', style: 'dark'
    },
    {
        name: 'Solarized Light', value: 'prism-solarizedlight', style: 'light'
    },
    {
        name: 'Tomorrow', value: 'prism-tomorrow', style: 'dark'
    }
]

export interface ICodeSelectorProps {
    codeLang: string,
    codeTheme: string
}

const selectorRow = css`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`

export function CodeSelector({value: {codeLang, codeTheme}, onChange}: {
    value: ICodeSelectorProps,
    onChange: (value: ICodeSelectorProps) => void
}) {

    return <div className={selectorRow}>
        <Select size={'small'} onChange={(event) => onChange({codeLang: event.target.value, codeTheme})}
                value={codeLang}>
            <MenuItem value="javascript">Javascript</MenuItem>
            <MenuItem value="csharp">C#</MenuItem>
            <MenuItem value="go">Golang</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="html">Html</MenuItem>
            <MenuItem value="css">CSS</MenuItem>
            <MenuItem value="svg">SVG</MenuItem>
            <MenuItem value="xml">XML</MenuItem>
            <MenuItem value="php">PHP</MenuItem>
            <MenuItem value="sql">SQL</MenuItem>
            <MenuItem value="bash">BASH</MenuItem>
            <MenuItem value="handlebars">Handlebars</MenuItem>
            <MenuItem value="protobuf">Protobuf</MenuItem>
            <MenuItem value="aspnet">ASP.NET</MenuItem>
            <MenuItem value="razor">Razor</MenuItem>
            <MenuItem value="jsx">JSX</MenuItem>
            <MenuItem value="ignore">ignore</MenuItem>
            <MenuItem value="ruby">Ruby</MenuItem>
            <MenuItem value="rust">Rust</MenuItem>
            <MenuItem value="json">JSON</MenuItem>
            <MenuItem value="cpp">C/C++</MenuItem>
            <MenuItem value="swift">Swift</MenuItem>
            <MenuItem value="dart">Dart</MenuItem>
            <MenuItem value="lua">Lua</MenuItem>
            <MenuItem value="zig">Zig</MenuItem>
            <MenuItem value="yaml">Yaml</MenuItem>
            <MenuItem value="perl">Perl</MenuItem>
        </Select>
        <Select size={'small'} value={codeTheme}
                onChange={(event) => onChange({codeLang, codeTheme: event.target.value})}>
            {codeThemes.map((child, index) =>
                <MenuItem key={index} value={child.value}>
                    {child.name}
                </MenuItem>
            )}
        </Select>
    </div>
}

