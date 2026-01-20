'use client'

import SearchIcon from '@mui/icons-material/Search';
import {useState} from "react";
import {transKey} from "@/components/common/locales/normal";

export function ContentSearchAction({pathname, queryKeyword, lang}: {
    pathname: string, queryKeyword: string,
    lang: string
}) {
    const [searchText, setSearchText] = useState(queryKeyword || '')
    const goSearch = () => {
        if (!searchText || !searchText.trim()) {
            return
        }
        window.location.href = `/${lang}/search?keyword=${searchText}`
    }
    return <div className="globalSearchBox">
        <input placeholder={transKey(lang, "searchPlaceholder")} maxLength={128} value={searchText}
               onChange={(event) => setSearchText(event.target.value)}
               onKeyDown={(event) => {
                   if (event.key === 'Enter') {
                       goSearch()
                   }
               }}/>
        <SearchIcon fontSize={'small'} onClick={goSearch}/>

        <style jsx>{`
            .globalSearchBox {
                border: solid 1px #ccc;
                border-radius: 6px;
                height: 26px;
                width: 200px;
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
                align-items: center;
                padding: 0 0.5rem;
            }

            .globalSearchBox :global(input) {
                border: none;
                outline: none;
                flex-grow: 1;
            }
        `}</style>
    </div>
}
