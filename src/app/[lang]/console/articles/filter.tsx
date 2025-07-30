'use client'

import styles from "./filter.module.scss";
import React from "react";
import {getLanguageProvider, ILanguageProvider} from "@/services/common/language";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import {localText} from "@/atom/common/language";

export function ConsoleArticleFilterBar({lang, keyword}: {
    lang: string,
    keyword: string
}) {
    const [searchText, setSearchText] = React.useState(keyword || '');
    const goSearch = () => {
        console.debug('go search', searchText);
    }
    const goCreateArticle = () => {
        window.location.href = `/${lang}/console/articles/${uuidToBase58(EmptyUUID)}`
    }
    const langProvider = getLanguageProvider(lang);
    return <div className={styles.middleTop}>
        <div className={styles.topLeft}>
            <Button size={'small'} variant={'contained'} onClick={goCreateArticle}>
                {localText(lang, '新增笔记', 'Create Article')}
            </Button>
        </div>
        <div className={styles.topRight}>
            <div className={styles.searchBox}>
                <input placeholder={langProvider.searchPlaceholder} maxLength={128} value={searchText}
                       onChange={(event) => setSearchText(event.target.value)}
                       onKeyDown={(event) => {
                           if (event.key === 'Enter') {
                               goSearch()
                           }
                       }}/>
                <SearchIcon fontSize={'small'} onClick={goSearch}/>
            </div>
        </div>
    </div>
}
