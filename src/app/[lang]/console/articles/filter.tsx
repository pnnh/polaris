import styles from "./filter.module.scss";
import {replaceSearchParams} from "@/atom/common/utils/query";
import React from "react";
import {ILanguageProvider} from "@/services/common/language";

export function ConsoleArticleFilterBar({langProvider, searchParamsValue}: {
    langProvider: ILanguageProvider,
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
               href={replaceSearchParams(searchParamsValue, 'sort', 'latest')}>{langProvider.latest}</a>
            <a className={styles.sortLink + sortClass('read')}
               href={replaceSearchParams(searchParamsValue, 'sort', 'read')}>{langProvider.readCount}</a>
        </div>
        <div className={styles.topRight}>
            <a className={styles.filterLink + filterClass('month')}
               href={replaceSearchParams(searchParamsValue, 'filter', 'month')}>{langProvider.lastMonth}</a>
            <a className={styles.filterLink + filterClass('year')}
               href={replaceSearchParams(searchParamsValue, 'filter', 'year')}>{langProvider.lastYear}</a>
            <a className={styles.filterLink + filterClass('all')}
               href={replaceSearchParams(searchParamsValue, 'filter', 'all')}>{langProvider.all}</a>
        </div>
    </div>
}
