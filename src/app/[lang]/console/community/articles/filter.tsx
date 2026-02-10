'use client'

import React from "react";
import {transKey} from "@/components/common/locales/normal";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import {EmptyUUID, uuidToBase58} from "@pnnh/atom";

export function ConsoleArticleFilterBar({lang, keyword}: {
    lang: string,
    keyword: string
}) {
    const [searchText, setSearchText] = React.useState(keyword || '');
    const goSearch = () => {
        console.debug('go search', searchText);
        window.location.href = `/${lang}/console/community/articles?keyword=${encodeURIComponent(searchText)}`
    }
    const goCreateArticle = () => {
        window.location.href = `/${lang}/console/community/articles/${uuidToBase58(EmptyUUID)}`
    }
    return <>
        <div className="middleTop">
            <div className="topLeft">
                <Button size={'small'} variant={'contained'} onClick={goCreateArticle}>
                    {transKey(lang, "console.article.createNew")}
                </Button>
            </div>
            <div className="topRight">
                <div className="searchBox">
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
        <style jsx>{`
            .middleTop {
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
            }

            .topLeft, .topRight {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
            }

            .searchBox {
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

            .searchBox input {
                border: none;
                outline: none;
                flex-grow: 1;
            }
        `}</style>
    </>
}
