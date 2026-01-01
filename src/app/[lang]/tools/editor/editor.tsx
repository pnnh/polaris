'use client'

import {SFXEditor} from "@pnnh/atom/browser";
import {SFEditorModel} from "@pnnh/atom/browser";
import {useState} from "react";
import {transText} from "@/components/common/locales/normal";

const initEditorValue: SFEditorModel = {
    children: [
        {
            name: 'paragraph',
            children: [
                {
                    name: 'text',
                    text: 'Welcome to SFX Editor! Start typing here...'
                }
            ]
        }
    ]
}

export function EditorComponent({lang}: { lang: string }) {
    const [editorValue, setEditorValue] = useState<SFEditorModel>(initEditorValue);

    return <div>

        <SFXEditor lang={lang} value={editorValue} onChange={setEditorValue}/>
        <div>
            <button onClick={() => {
                console.log('Raw Editor Value:', JSON.stringify(editorValue, null, 2));
            }}>{transText(lang, '输出原始文本', 'Output raw text')}</button>
        </div>
    </div>
}
