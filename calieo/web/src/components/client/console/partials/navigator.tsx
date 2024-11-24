'use client'

import './navigator.scss'

export function NavigatorBar() {
    return <div className={'navigatorBar'}>
        <NavIcon src={'/icons/console/navigator/home.svg'}/>
        <NavIcon src={'/icons/console/navigator/left.svg'}/>
        <NavIcon src={'/icons/console/navigator/right.svg'}/>
        <NavIcon src={'/icons/console/navigator/up.svg'}/>
        <NavIcon src={'/icons/console/navigator/global.svg'}/>
        <URILocation/>
        <SearchContainer/>
        <NavIcon src={'/icons/console/navigator/favorite.svg'}/>
        <NavIcon src={'/icons/console/navigator/history.svg'}/>
        <NavIcon src={'/icons/console/navigator/menu.svg'}/>
    </div>
}


function NavIcon({src}: { src: string }) {
    return <div className={'navIcon'}>
        <img src={src} alt={'home'}/>
    </div>
}

function URILocation() {
    return <div className={'uriLocation'}>
        <input value={'filesystem://home'} onChange={() => {
        }}/>
    </div>
}

function SearchContainer() {
    return <div className={'searchContainer'}>
        <input placeholder={'输入搜索内容'}/>
    </div>
}
