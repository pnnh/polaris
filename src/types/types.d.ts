import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'polaris-markdown-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}
