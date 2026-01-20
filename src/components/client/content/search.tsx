'use client'

import Image from "next/image";
import React, {CSSProperties} from "react";

export function ContentSearchAction({pathname, queryKeyword}: { pathname: string, queryKeyword: string | undefined }) {
    const [keyword, setKeyword] = React.useState(queryKeyword ?? '')
    let style: CSSProperties = {}
    if (pathname.startsWith('/content/search')) {
        style = {
            borderColor: '#4A95DD',
        }
    }
    const doSearch = () => {
        window.location.href = `/content/search?keyword=${encodeURIComponent(keyword)}`
    }

    return <>
        <div className={'searchContainer'} style={style}>
        <input className={'searchInput'} value={keyword} onChange={(event) => {
            setKeyword(event.target.value)
        }} onKeyDown={(event) => {
            if (event.key === 'Enter') {
                doSearch()
            }
        }} placeholder={'搜索'}/>
        <div className={'iconContainer'} onClick={() => doSearch}>
            <Image className={'searchIcon'}
                   src='/icons/materials/search_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg'
                   alt='search' height={24}
                   width={24}/>
        </div>
    </div>
    <style jsx>{`
      .searchContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 6px;
        overflow: hidden;
      }
      .searchInput {
        width: 12rem;
        height: 1.8rem;
        padding: 0 4px;
        font-size: 0.9rem;
        border: 0;
        outline-color: transparent;
      }
      @media (max-width: 48rem) {
        .searchInput {
          width: 8rem;
        }
      }
      .iconContainer {
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }
      .searchIcon {
        margin-right: 6px;
        filter: drop-shadow(0px 100px #aaa);
        transform: translateY(-100px);
      }
    `}</style>
    </>
}
