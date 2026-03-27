'use client'

import React from "react";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {EmptyUUID, uuidToBase58} from "@pnnh/atom";
import {css} from "@/gen/styled/css";

export function ManagementToolFilterBar({lang, keyword}: {
    lang: string,
    keyword: string
}) {
    const [searchText, setSearchText] = React.useState(keyword || '');

    const goSearch = () => {
        const url = new URL(window.location.href);
        if (searchText) {
            url.searchParams.set('keyword', searchText);
        } else {
            url.searchParams.delete('keyword');
        }
        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    }

    const clearSearch = () => {
        setSearchText('');
        const url = new URL(window.location.href);
        url.searchParams.delete('keyword');
        url.searchParams.delete('page');
        window.location.href = url.pathname + url.search;
    }

    const goCreateTool = () => {
        window.location.href = `/${lang}/management/tools/${uuidToBase58(EmptyUUID)}`
    }

    return <div className={filterStyles.middleTop}>
        <div className={filterStyles.topLeft}>
            <Button size={'small'} variant={'contained'} onClick={goCreateTool}>
                新建工具
            </Button>
        </div>
        <div className={filterStyles.topRight}>
            <div className={filterStyles.searchBox}>
                <input
                    placeholder={'搜索工具...'}
                    maxLength={128}
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') goSearch()
                    }}
                />
                {searchText && (
                    <ClearIcon
                        fontSize={'small'}
                        onClick={clearSearch}
                        style={{cursor: 'pointer', color: '#999'}}
                    />
                )}
                <SearchIcon
                    fontSize={'small'}
                    onClick={goSearch}
                    style={{cursor: 'pointer'}}
                />
            </div>
        </div>
    </div>
}

const filterStyles = {
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
        flex-shrink: 0;
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

        & input {
            border: none;
            outline: none;
            flex-grow: 1;
        }
    `
}
