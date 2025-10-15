import styles from "./filter.module.scss";
import {replaceSearchParams} from "@/atom/common/utils/query";
import React from "react";
import {transText} from "@/services/common/locales/normal";

export function ArticleFilterBar({lang, searchParamsValue}: {
    lang: string,
    searchParamsValue: Record<string, string>
}) {
    const sortClass = (sort: string) => {
        const querySort = (searchParamsValue.sort ?? 'latest')
        return ' ' + (querySort === sort ? styles.activeLink : '')
    }
    const filterClass = (filter: string) => {
        const queryFilter = (searchParamsValue.filter ?? 'all')
        return ' ' + (queryFilter === filter ? styles.activeLink : '')
    }
    return <div className={styles.middleTop}>
        <div className={styles.topLeft}>
            <a className={styles.sortLink + sortClass('latest')}
               href={replaceSearchParams(searchParamsValue, 'sort', 'latest')}>
                {transText(lang, "latest")}</a>
            <a className={styles.sortLink + sortClass('read')}
               href={replaceSearchParams(searchParamsValue, 'sort', 'read')}>
                {transText(lang, "readRank")}</a>
        </div>
        <div className={styles.topRight}>
            <a className={styles.filterLink + filterClass('month')}
               href={replaceSearchParams(searchParamsValue, 'filter', 'month')}>
                {transText(lang, "lastMonth")}</a>
            <a className={styles.filterLink + filterClass('year')}
               href={replaceSearchParams(searchParamsValue, 'filter', 'year')}>
                {transText(lang, "lastYear")}</a>
            <a className={styles.filterLink + filterClass('all')}
               href={replaceSearchParams(searchParamsValue, 'filter', 'all')}>
                {transText(lang, "all")}</a>
        </div>
    </div>
}
