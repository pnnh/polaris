'use client'

import styles from './search.module.scss'
import SearchIcon from '@mui/icons-material/Search';
import {useEffect, useState} from "react";

export function ContentSearchAction({pathname, queryKeyword}: { pathname: string, queryKeyword: string }) {
    const [searchText, setSearchText] = useState(queryKeyword || '')
    const goSearch = () => {
        if (!searchText || !searchText.trim()) {
            return
        }
        window.location.href = `/search?keyword=${searchText}`
    }
    return <div className={styles.globalSearchBox}>
        <input placeholder={'搜索'} maxLength={128} value={searchText}
               onChange={(event) => setSearchText(event.target.value)}
               onKeyDown={(event) => {
                   if (event.key === 'Enter') {
                       goSearch()
                   }
               }}/>
        <SearchIcon fontSize={'small'} onClick={goSearch}/>
    </div>
}
