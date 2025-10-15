'use client'

import styles from "./filter.module.scss";
import React from "react";
import {transText} from "@/services/common/locales/normal";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import {uuidToBase58} from "@/atom/common/utils/basex";
import {EmptyUUID} from "@/atom/common/utils/uuid";
import {localText} from "@/atom/common/language";

export function ConsoleChannelFilterBar({lang, keyword}: {
    lang: string,
    keyword: string
}) {
    const [searchText, setSearchText] = React.useState(keyword || '');
    const goSearch = () => {
        console.debug('go search', searchText);
    }
    const goCreateChannel = () => {
        window.location.href = `/${lang}/console/channels/${uuidToBase58(EmptyUUID)}`
    }
    return <div className={styles.middleTop}>
        <div className={styles.topLeft}>
            <Button size={'small'} variant={'contained'} onClick={goCreateChannel}>
                {localText(lang, '新建频道', 'Create Channel')}
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
