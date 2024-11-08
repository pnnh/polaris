import React from 'react'
import './tool.scss'
import {selectApps} from "@/services/server/tools/tools";

export async function ToolBody({lang}: { lang: string }) {
    const appList = selectApps(lang)
    return <div className={'toolBodyComponent'}>
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
}
