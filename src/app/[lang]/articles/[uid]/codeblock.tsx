'use client'

import Prism, {Grammar} from 'prismjs'
import {encodeHTML} from "entities";

// import '@/atom/client/editor/highlight'

export function renderCodeBlock(contentText: string, filePath: string) {
    const lowerFilePath = filePath.toLowerCase();
    const extName = lowerFilePath.split('.').pop();
    if (!extName) {
        return encodeHTML(contentText)
    }
    let markLang = 'javascript'
    let grammar = Prism.languages.javascript
    switch (extName) {
        case 'html':
        case 'htm':
            markLang = 'html'
            grammar = Prism.languages.html
            break
        case 'js':
        case 'jsx':
            markLang = 'javascript'
            grammar = Prism.languages.javascript
            break
        case 'ts':
        case 'tsx':
            markLang = 'typescript'
            grammar = Prism.languages.typescript
            break
        case 'json':
            markLang = 'json'
            grammar = Prism.languages.json
            break
        case 'css':
            markLang = 'css'
            grammar = Prism.languages.css
            break
        case 'java':
            markLang = 'java'
            grammar = Prism.languages.java
            break
        case 'py':
            markLang = 'python'
            grammar = Prism.languages.python
            break
        case 'rb':
            markLang = 'ruby'
            grammar = Prism.languages.ruby
            break
        case 'php':
            markLang = 'php'
            grammar = Prism.languages.php
            break
        case 'go':
            markLang = 'go'
            grammar = Prism.languages.go
            break
        case 'rs':
            markLang = 'rust'
            grammar = Prism.languages.rust
            break
        case 'c':
            markLang = 'c'
            grammar = Prism.languages.c
            break
        case 'cpp':
        case 'cc':
        case 'cxx':
        case 'hpp':
        case 'h':
            markLang = 'cpp'
            grammar = Prism.languages.cpp
            break
        case 'cs':
            markLang = 'csharp'
            grammar = Prism.languages.csharp
            break
        case 'kt':
        case 'kts':
            markLang = 'kotlin'
            grammar = Prism.languages.kotlin
            break
        case 'sql':
            markLang = 'sql'
            grammar = Prism.languages.sql
            break
        case 'md':
        case 'markdown':
            markLang = 'markdown'
            grammar = Prism.languages.markdown
            break
        case 'sh':
        case 'bash':
        case 'zsh':
            markLang = 'bash'
            grammar = Prism.languages.bash
            break
        case "txt":
            if (lowerFilePath.endsWith("cmakelists.txt")) {
                markLang = 'cmake'
                grammar = Prism.languages.cmake
                break
            } else {
                return encodeHTML(contentText)
            }
        case 'cmake':
            markLang = 'cmake'
            grammar = Prism.languages.cmake
            break
        default:
            return encodeHTML(contentText)
    }
    return Prism.highlight(contentText, grammar, markLang)
}
