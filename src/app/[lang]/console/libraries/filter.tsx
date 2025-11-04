'use client'

import styles from "./filter.module.scss";
import React from "react";
import {transText} from "@/components/common/locales/normal";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import {clientSelectImageDirectory} from "@/components/client/images/service";

export function ConsoleLibraryFilterBar({lang, keyword}: {
    lang: string,
    keyword: string
}) {
    const [searchText, setSearchText] = React.useState(keyword || '');
    const goSearch = () => {
        console.debug('go search', searchText);
    }
    const goCreateArticle = () => {
        clientSelectImageDirectory().then(data => {
            if (data && data.length > 0) {
                console.log('selected files', data);
            }
        }).catch(error => {
            console.error('select files error', error);
        })
    }
    return <div className={styles.middleTop}>
        <div className={styles.topLeft}>
            <Button size={'small'} variant={'contained'} onClick={goCreateArticle}>
                打开图片目录
            </Button>
        </div>
        <div className={styles.topRight}>
            <div className={styles.searchBox}>
                <input placeholder={transText(lang, "searchPlaceholder")} maxLength={128} value={searchText}
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
