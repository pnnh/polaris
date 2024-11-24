import {TocItem} from '@pnnh/stele'
import {css, styleGroup} from "@/components/style";

const styles = styleGroup.create({
    tocCard: css`
        background-color: #FFF;
        border-radius: 4px;
    `,
    tocHeader: css`
        padding: 1rem;
        border-bottom: solid 1px #e1e1e280;
    `,
    tocBody: css`
        padding: 1rem;
    `,
    tocItem: css`
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        padding-right: 0.5rem;
        font-size: 14px;
    `,
    itemHeader: css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        a {
            color: #333;
            text-decoration: none;
        }
    `
})

export function TocInfo(props: { readurl: string, model: TocItem[] }) {

    return <div className={styles.tocCard.className}>
        <div className={styles.tocHeader.className}>
            目录信息
        </div>
        <div className={styles.tocBody.className}>
            {
                props.model && props.model.length > 0
                    ? props.model.map((model, index) => {
                        return <div key={`toc-${index}`} className={styles.tocItem.className}>
                            <div className={styles.itemHeader.className} style={{paddingLeft: `${0.5 * model.header}rem`}}>
                                <a href={props.readurl + '#' + model.id} title={model.title}>{model.title}</a>
                            </div>
                        </div>
                    })
                    : '暂无'
            }
        </div>
    </div>
}
