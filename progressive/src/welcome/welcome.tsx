
import * as React from "react";
import './welcome.scss'
import {selectApps} from "@pnnh/polaris-business";

export function WelcomePage() {
    const appList = selectApps()
    return <div className={'styleWelcome'}>
        <h1>希波万象</h1>
        <div className={'styleTips'}>请点击工具图标开始使用</div>
        <div className={'styleActions'}>
            <div className={'toolBodyComponent'}>
                <div className={'appGrid'}>
                    {
                        appList.map(app => {
                            return <div className={'appCard'} key={app.urn}>
                                <img className={'appImage'} src={app.image} alt={app.name}/>
                                <div className={'appTitle'}>
                                    <a style={{color: '#333', textDecoration: 'none'}} href={app.url}>{app.name}</a>
                                </div>
                                <p className={'appDescription'}>{app.description}</p>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </div>
}

