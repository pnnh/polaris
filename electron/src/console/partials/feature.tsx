import React from 'react'
import './feature.scss'

export function ConsoleFeature() {
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
                    <img src="/data/photos/3.webp" alt='trash'
                         sizes='28px,28px'/>
                </div>
            </div>
        </div>
    </div>
}
