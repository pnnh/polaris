import React, {useEffect} from 'react'
import './layout.scss'
import {filesMailbox} from "@/console/providers/notebook";
import {PSFileModel} from "../../../business/src/common/models/file";

export function ConsoleLayout({
                                  children
                              }: {
    children: React.ReactNode
}) {
    return (
        <div className={'consolePage'}>
            <div className={'mainContainer'}>
                <div className={'topHeader'}>
                    <NavIconGroup/>
                    <NavLocation/>
                </div>
                <div className={'bottomBody'}>
                    {children}
                </div>
            </div>
        </div>
    )
}

function NavIconGroup() {
    return <div className={'navIconGroup'}>
        <div className={'navIcon'}>
            <img src={'/icons/navbar/global.png'} alt={'global'}/>
        </div>
        <div className={'navIcon'}>
            <img src={'/icons/navbar/home.png'} alt={'home'}/></div>
        <div className={'navIcon'}>
            <img src={'/icons/navbar/back.png'} alt={'back'}/></div>
        <div className={'navIcon'}>
            <img src={'/icons/navbar/forward.png'} alt={'forward'}/></div>
        <div className={'navIcon'}>
            <img src={'/icons/navbar/up.png'} alt={'up'}/></div>
    </div>
}

function NavLocation() {
    const [currentDomainPath, setCurrentDomainPath] = React.useState<string>('')
    useEffect(() => {
        window.serverAPI.getDomainPath().then((path) => {
            console.debug('CurrentDomainPath', path)
            setCurrentDomainPath(path)
        })

        const stub = filesMailbox.subscribe<PSFileModel>('domainPath', (mail) => {
            const fileModel = mail.content as PSFileModel
            setCurrentDomainPath(fileModel.Url)
        })
        console.log('registerComponent')
        return () => {
            console.log('unregisterComponent')
            filesMailbox.unsubscribe(stub)
        }


    }, []);
    return <div className={'navLocation'}>
        <input className={'locationInput'} value={currentDomainPath} onChange={(event) => {
            console.debug('Change Domain Path', event.target.value)
        }}/>
    </div>
}
