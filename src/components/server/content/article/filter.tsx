import {css, cx} from "@/gen/styled/css";
import {replaceSearchParams} from "@pnnh/atom";
import React from "react";
import {transKey} from "@/components/common/locales/normal";

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
    sortLink: css`
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        color: #5b6679;
        text-decoration: none;
    `,
    filterLink: css`
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        color: #5b6679;
        text-decoration: none;
    `,
    activeLink: css`
        background-color: #e6e6e6;
    `,
};

export function ArticleFilterBar({lang, searchParamsValue}: {
    lang: string,
    searchParamsValue: Record<string, string>
}) {
    const sortClass = (sort: string) => {
        const querySort = (searchParamsValue.sort ?? 'latest')
        return querySort === sort ? styles.activeLink : ''
    }
    const filterClass = (filter: string) => {
        const queryFilter = (searchParamsValue.filter ?? 'all')
        return queryFilter === filter ? styles.activeLink : ''
    }
    return <div className={styles.middleTop}>
        <div className={styles.topLeft}>
            <a className={cx(styles.sortLink, sortClass('latest'))}
               href={replaceSearchParams(searchParamsValue, 'sort', 'latest')}>
                {transKey(lang, "latest")}</a>
            <a className={cx(styles.sortLink, sortClass('read'))}
               href={replaceSearchParams(searchParamsValue, 'sort', 'read')}>
                {transKey(lang, "readRank")}</a>
        </div>
        <div className={styles.topRight}>
            <a className={cx(styles.filterLink, filterClass('month'))}
               href={replaceSearchParams(searchParamsValue, 'filter', 'month')}>
                {transKey(lang, "lastMonth")}</a>
            <a className={cx(styles.filterLink, filterClass('year'))}
               href={replaceSearchParams(searchParamsValue, 'filter', 'year')}>
                {transKey(lang, "lastYear")}</a>
            <a className={cx(styles.filterLink, filterClass('all'))}
               href={replaceSearchParams(searchParamsValue, 'filter', 'all')}>
                {transKey(lang, "all")}</a>
        </div>
    </div>
}
