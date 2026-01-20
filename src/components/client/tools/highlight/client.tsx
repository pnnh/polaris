'use client'

import './selector'
import {CodeSelector, ICodeSelectorProps,} from "./selector";
// @ts-ignore
import domToImage from 'dom-to-image-more';
import * as React from "react";
import Prism from 'prismjs';
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import {Button} from '@mui/material';

export function highlightCode(code: string, language: string) {
    return Prism.highlight(code, Prism.languages.javascript, 'javascript');
}

export function HighlightComponent({lang}: { lang: string }) {
    const [name, setName] = React.useState<string | undefined>(undefined);
    const [codeText, setCodeText] = React.useState<string>(`
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
]`);
    const [darkTheme, setDarkTheme] = React.useState<boolean>(false);
    const [codeProps, setCodeProps] = React.useState<ICodeSelectorProps>({codeLang: 'javascript', codeTheme: 'prism'});
    // const [codeHtml, setCodeHtml] = React.useState<string>('');
    const formatCode = () => {
        console.log('formatCode');
        if (!codeText || !codeProps.codeLang || !codeProps.codeTheme) {
            return;
        }
        const previewCode = document.getElementById('previewCode');
        if (!previewCode) {
            console.error('previewCode not found');
            return;
        }

        const html = highlightCode(codeText, codeProps.codeLang);

        previewCode.innerHTML = html;
    }

    const exportImage = () => {
        const previewBlock = document.getElementById('previewPre');
        if (!previewBlock) {
            console.error('Preview block not found');
            return;
        }
        domToImage
            .toPng(previewBlock)
            .then(function (dataUrl: string) {
                // var img = new Image();
                // img.src = dataUrl;
                // document.body.appendChild(img);
                const link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            })
            .catch(function (error: Error) {
                console.error('oops, something went wrong!', error);
            });
    }
    return <div className="editorContainer">
        <link rel={'stylesheet'} href={`/assets/prismjs/themes/${codeProps.codeTheme}.min.css`}></link>
        <div className="codeBlockContainer">
            <textarea value={codeText} onChange={(event) => setCodeText(event.target.value)}/>
        </div>
        <div className="selectorContainer">
            <CodeSelector value={codeProps} onChange={setCodeProps}/>
        </div>
        <div className="actionContainer">
            <Button variant={'contained'} onClick={formatCode}>格式化</Button>
            <Button variant={'contained'} onClick={exportImage}>导出图像</Button>
        </div>
        <div className="previewContainer">
            <div id={'previewBlock'} className={`previewBlock prism-theme ${darkTheme ? 'dark' : ''}`}>
                <pre id={'previewPre'} className={`language-${codeProps.codeLang}`} tabIndex={0}>
                    <code id={'previewCode'} className={`language-${codeProps.codeLang}`}></code>
                </pre>
            </div>
        </div>

        <style jsx>{`
            .editorContainer {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-items: center;
                align-items: center;
            }

            .editorContainer :global(textarea) {
                font-family: monospace;
                font-size: 0.9rem;
                background-color: #ffffff;
                border: 0;
                flex-grow: 1;
                width: calc(100% - 2rem);
                padding: 1rem;
                overflow: auto;
                scrollbar-width: thin;
            }

            .codeBlockContainer {
                font-family: monospace;
                font-size: 0.9rem;
                padding: 1rem;
                background-color: #FFFFFF;
                height: 20rem;
                width: 100%;
                border-radius: 4px;
            }

            .codeBlockContainer :global(textarea) {
                width: 100%;
                height: 100%;
            }

            .selectorContainer {
                margin-top: 1rem;
                width: 100%;
                margin-bottom: 1rem;
            }

            .actionContainer {
                padding: 0.5rem 1rem;
                width: 100%;
                margin-bottom: 1rem;
                background-color: #FFFFFF;
                display: flex;
                flex-direction: row;
                gap: 1rem;
            }

            .previewContainer {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .previewBlock {
                width: 100%;
                margin-bottom: 1rem;
                height: 32rem;
                overflow: auto;
                scrollbar-width: thin;
                border-radius: 4px;
            }

            .previewBlock.dark {
                background-color: #333;
            }

            .previewBlock :global(pre) {
                padding: 0;
                margin: 0;
                display: block;
                width: 100%;
                overflow: hidden;
                border: 0;
                background-color: transparent;
            }

            .previewBlock :global(pre span) {
                border: 0 !important;
                background-color: transparent !important;
            }

            .previewBlock :global(pre code) {
                display: block;
                width: 100%;
                overflow: hidden;
                border: 0;
                background-color: transparent;
            }
        `}</style>
    </div>
}


