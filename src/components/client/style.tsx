'use client';

import {useEffect} from "react";

export function StyleTag({comId, styleText, inline}: { comId: string, styleText: string, inline: boolean }) {
    const styleId = `style-${comId}`;
    useEffect(() => {
        if (inline) {
            // If inline styles are used, we don't need to create a style tag
            return;
        }
        if (!styleText || !comId) {
            console.warn('StyleTag: styleText or comId is empty');
            return
        }
        const styleEl = document.getElementById(styleId)
        if (styleEl) {
            return
        }
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = styleText;
        document.head.appendChild(style);
        return () => {
            const styleEl = document.getElementById(styleId);
            if (styleEl) {
                styleEl.remove();
            }
        }

    }, [styleText])
    return (
        inline && styleText ? <style id={styleId}>{styleText}</style> : null
    );
}
