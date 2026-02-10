'use client'

import {SFEditorModel, SFXEditor} from "@pnnh/atom/browser";
import {useState} from "react";
import {transKey} from "@/components/common/locales/normal";

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
            }}>{transKey(lang, "tools.editor.outputRawText")}</button>
        </div>
    </div>
}
