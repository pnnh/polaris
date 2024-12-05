import * as React from "react";

export function WelcomePage() {
    return <div className={'styleWelcome'}>
        <h1>欢迎使用</h1>
        <div className={'styleTips'}>请新建资料库或打开已有资料库</div>
        <div className={'styleActions'}>
            <button>新建资料库</button>
            <button>打开资料库</button>
        </div>
    </div>
}

