import React from 'react';

// 如果你的 Web Component 有自定义属性，先定义它们的接口
interface MyCustomElementProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    // 在这里添加 Web Component 特有的属性
    "my-attribute"?: string;
    "is-active"?: boolean;
    // 如果有自定义事件，通常在 React 中通过 ref 添加监听，
    // 但为了防止 TS 报错，也可以在这里声明
    oncustomclick?: (event: CustomEvent) => void;
    // 必须包含 children，否则无法在标签内嵌套内容
    children?: React.ReactNode;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // 注册你的自定义标签
            'my-custom-element': MyCustomElementProps;
            'another-web-component': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'polaris-markdown-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}
