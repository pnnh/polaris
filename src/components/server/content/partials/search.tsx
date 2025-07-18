'use client'

import styles from './search.module.scss'
import SearchIcon from '@mui/icons-material/Search';
import {useEffect, useState} from "react";
import {getLanguageProvider, ILanguageProvider} from "@/services/common/language";

export function ContentSearchAction({pathname, queryKeyword, lang}: {
    pathname: string, queryKeyword: string,
    lang: string
}) {
    const [searchText, setSearchText] = useState(queryKeyword || '')
    const goSearch = () => {
        if (!searchText || !searchText.trim()) {
            return
        }
        window.location.href = `/search?keyword=${searchText}`
    }
    const langProvider = getLanguageProvider(lang)
    return <div className={styles.globalSearchBox}>
        <input placeholder={langProvider.searchPlaceholder} maxLength={128} value={searchText}
               onChange={(event) => setSearchText(event.target.value)}
               onKeyDown={(event) => {
                   if (event.key === 'Enter') {
                       goSearch()
                   }
               }}/>
        <SearchIcon fontSize={'small'} onClick={goSearch}/>
    </div>
}
