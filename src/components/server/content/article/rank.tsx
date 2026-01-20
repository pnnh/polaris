import React from "react";
import {css} from "@/gen/styled/css";
import {PLSelectResult, uuidToBase58} from "@pnnh/atom";
import {PSArticleModel} from "@/components/common/models/article";

const styles = {
    rankCard: css`
        background-color: var(--background-color);
        border-radius: 4px;
    `,
    rankHeader: css`
        padding: 0.5rem 1rem;
        border-bottom: solid 1px #e1e1e280;
        font-size: 1rem;
    `,
    rankBody: css`
        padding: 1rem;
    `,
    rankTitle: css`
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        & a {
            color: var(--text-primary-color);
            text-decoration: none;
        }
    `,
    rankItem: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        padding: 4px 0;
        &:hover {
            background-color: #f1f2f7;
        }
    `,
    rankIndex: css`
        text-align: center;
        width: 1.5rem;
        flex-shrink: 0;
        font-family: Archivo, serif;
        font-weight: 700;
    `,
    rankTop: css`
        color: red;
    `,
};

export function ArticleRankCard({rankResult, lang}: { rankResult: PLSelectResult<PSArticleModel>, lang: string }) {
    return <div className={styles.rankCard}>
        <div className={styles.rankHeader}>
            年度阅读排行
        </div>
        <div className={styles.rankBody}>
            {
                rankResult && rankResult.data && rankResult.data.range && rankResult.data.range.length > 0
                    ? rankResult.data.range.map((model, index) => {
                        const readUrl = `${lang}/articles/${uuidToBase58(model.uid)}`
                        return <div key={index} className={styles.rankItem}>
                            <div
                                className={`${styles.rankIndex} ${index <= 2 ? styles.rankTop : ''}`}>{index + 1}</div>
                            <div className={styles.rankTitle}>
                                <a href={readUrl} title={model.title}>{model.title}</a>
                            </div>
                        </div>
                    })
                    : '暂无'
            }
        </div>
    </div>
}
