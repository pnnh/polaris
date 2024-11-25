export interface BCComponent {
    new(props: { [id: string]: string }): BCComponent;

    renderToString(): string;
}

export const JSX = {
    createElement(name: string | BCComponent, props: { [id: string]: string }, ...content: string[]) {
        props = props || {};
        const typeName = (typeof name);
        if (typeName === "function") {
            const factory = (name as BCComponent);
            const instance = new factory(props);
            return instance.renderToString();
        }
        const propsstr = Object.keys(props)
            .map(key => {
                const value = props[key];
                if (key === "className") return `class=${value}`;
                else return `${key}=${value}`;
            })
            .join(" ");
        return `<${name} ${propsstr}> ${content.join("")}</${name}>`;
    },
};

export const React = JSX

export default JSX;
