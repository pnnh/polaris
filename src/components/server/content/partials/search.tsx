'use client'

import styles from './search.module.scss'
import SearchIcon from '@mui/icons-material/Search';
import {useEffect, useState} from "react";
import {transText} from "@/services/common/locales/normal";

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
    return <div className={styles.globalSearchBox}>
        <input placeholder={transText(lang, "searchPlaceholder")} maxLength={128} value={searchText}
               onChange={(event) => setSearchText(event.target.value)}
               onKeyDown={(event) => {
                   if (event.key === 'Enter') {
                       goSearch()
                   }
               }}/>
        <SearchIcon fontSize={'small'} onClick={goSearch}/>
    </div>
}
