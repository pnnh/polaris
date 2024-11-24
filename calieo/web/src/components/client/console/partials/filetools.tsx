import './filetools.scss'

export function FileToolsBar() {
    return <div className={'fileToolsBar'}>
        <div className={'leftArea'}>
            <NavIcon src={'/icons/console/filetools/newFile.svg'}/>
            <NavIcon src={'/icons/console/filetools/newFolder.svg'}/>
            <NavIcon src={'/icons/console/filetools/cut.svg'}/>
            <NavIcon src={'/icons/console/filetools/rename.svg'}/>
        </div>
        <div className={'rightArea'}>
            <NavIcon src={'/icons/console/filetools/sort.svg'}/>
            <NavIcon src={'/icons/console/filetools/view.svg'}/>
            <NavIcon src={'/icons/console/filetools/filter.svg'}/>
        </div>
    </div>
}

function NavIcon({src}: { src: string }) {
    return <div className={'navIcon'}>
        <img src={src} alt={'home'}/>
    </div>
}
