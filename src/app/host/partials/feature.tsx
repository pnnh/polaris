'use client'
import React from 'react'
import './feature.scss'
import {generateUuidV7} from "@/atom/common/utils/basex";
import {AccountModel} from "@/atom/common/models/account";
import {checkLoginStatus} from "@/app/host/services/client/account/account";

export function ConsoleFeature() {
    const [accountModel, setAccountModel] = React.useState<AccountModel | null>(null)
    const openSigninLink = async () => {
        const appConfig = await window.serverAPI.getAppConfig()
        const linkId = generateUuidV7()
        const loginLink = `${appConfig.PUBLIC_POLARIS_URL}/en/account/signin?app=thunder&link=${linkId}`
        await window.serverAPI.openExternal(loginLink)
        let retryTimes = 0
        const inter = setInterval(async () => {
            retryTimes += 1
            console.debug('Checking login status, attempt:', retryTimes)
            if (retryTimes > 180) {
                clearInterval(inter)
                return
            }

            const model = await checkLoginStatus(linkId)
            if (model) {
                clearInterval(inter)
                setAccountModel(model)
            }
        }, 1000)
    }
    let userImageUrl = "/data/photos/3.webp"
    if (accountModel) {
        userImageUrl = accountModel.photoUrl
    }
    return <div className={'consoleFeature'}>
        <div className={'topArea'}>
            <div className={'featureList'}>
                <div className={'featureButton'}>
                    <img src="/icons/console/file-copy-line.png" alt='notes'
                         sizes='24px,24px'/>
                </div>
                <div className={'featureButton'}>
                    <img src="/icons/console/todo-fill.png" alt='todo'
                         sizes='24px,24px'/>
                </div>
                <div className={'featureButton'}>
                    <img src="/icons/console/calendar-fill.png" alt='calendar'
                         sizes='24px,24px'/>
                </div>
                {/*<div className={featureButton}>*/}
                {/*    <img src="/icons/console/image-2-fill.png" alt='resources'*/}
                {/*         sizes='24px,24px'/>*/}
                {/*</div>*/}
            </div>
            <div className={'trashList'}>
                <div className={'featureButton'}>
                    <img src="/icons/console/trash.png" alt='trash'
                         sizes='24px,24px'/>
                </div>
            </div>
        </div>
        <div className={'bottomArea'}>
            <div className={'accountList'}>
                <div className={'accountButton'}>
                    <img src={userImageUrl} alt='trash'
                         sizes='28px,28px' onClick={() => {
                        openSigninLink().then()
                    }}/>
                </div>
            </div>
        </div>
    </div>
}
