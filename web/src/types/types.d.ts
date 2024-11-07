export {} // 该行不能去掉，否则会提示类型不存在

declare global {
    declare namespace JSX {
        interface IntrinsicElements {
            'polaris-codeblock': PersonInfoProps;
        }
    }

    interface PersonInfoProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
        language: string
    }
}