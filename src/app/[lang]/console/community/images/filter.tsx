'use client'

import {css} from '@emotion/css'
import React from "react";
import {transKey} from "@/components/common/locales/normal";
import SearchIcon from "@mui/icons-material/Search";

const styles = {
    middleTop: css`
        border-bottom: solid 1px #e1e1e280;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0.5rem;
        font-size: 0.8rem;
        background-color: var(--background-color);
        height: 3rem;
    `,
    topLeft: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    `,
    topRight: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    `,
    searchBox: css`
        border: solid 1px #ccc;
        border-radius: 6px;
        height: 26px;
        width: 200px;
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        padding: 0 0.5rem;

        input {
            border: none;
            outline: none;
            flex-grow: 1;
        }
    `
}

export function ConsoleImageFilterBar({lang, keyword}: {
    lang: string,
    keyword: string
}) {
    const [searchText, setSearchText] = React.useState(keyword || '');
    const goSearch = () => {
        console.debug('go search', searchText);
    }
    return <div className={styles.middleTop}>
        <div className={styles.topLeft}>
            {/*<Button size={'small'} variant={'contained'} onClick={goCreateArticle}>*/}
            {/*    打开图片目录*/}
            {/*</Button>*/}
        </div>
        <div className={styles.topRight}>
            <div className={styles.searchBox}>
                <input placeholder={transKey(lang, "searchPlaceholder")} maxLength={128} value={searchText}
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
