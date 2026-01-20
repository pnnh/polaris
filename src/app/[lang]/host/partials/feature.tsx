'use client'

import React from 'react'
import {generateUuidV7} from "@pnnh/atom";
import {checkLoginStatus} from "@/app/[lang]/host/services/client/account/account";
import {AccountModel} from "@/components/common/models/account/account";

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
    return <div className="consoleFeature">
        <div className="topArea">
            <div className="featureList">
                <div className="featureButton">
                    <img src="/icons/console/file-copy-line.png" alt='notes'
                         sizes='24px,24px'/>
                </div>
                <div className="featureButton">
                    <img src="/icons/console/todo-fill.png" alt='todo'
                         sizes='24px,24px'/>
                </div>
                <div className="featureButton">
                    <img src="/icons/console/calendar-fill.png" alt='calendar'
                         sizes='24px,24px'/>
                </div>
            </div>
            <div className="trashList">
                <div className="featureButton">
                    <img src="/icons/console/trash.png" alt='trash'
                         sizes='24px,24px'/>
                </div>
            </div>
        </div>
        <div className="bottomArea">
            <div className="accountList">
                <div className="accountButton">
                    <img src={userImageUrl} alt='trash'
                         sizes='28px,28px' onClick={() => {
                        openSigninLink().then()
                    }}/>
                </div>
            </div>
        </div>
        <style jsx>{`
          .consoleFeature {
            width: 100%;
            height: 100%;
            flex-direction: column;
            gap: 16px;
            border-right: #eeeeee 0.5px solid;
            background-color: #f2f2f2;
            display: flex;
          }
          .topArea {
            padding-top: 16px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: 100%;
            gap: 16px;
            flex-grow: 1;
          }
          .featureList {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            gap: 16px;
            flex-grow: 1;
          }
          .featureButton {
            width: 24px;
            height: 24px;
            position: relative;
          }
          .trashList {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            width: 100%;
            gap: 16px;
            flex-grow: 1;
          }
          .bottomArea {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 16px;
            width: 100%;
          }
          .accountList {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 100%;
            border-top: #eeeeee 0.5px solid;
            padding-top: 8px;
            padding-bottom: 8px;
          }
          .accountButton {
            width: 28px;
            height: 28px;
            position: relative;
          }
          .accountButton img {
            width: 100%;
            height: 100%;
            border-radius: 14px;
            object-fit: cover;
          }
        `}</style>
    </div>
}
