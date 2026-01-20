'use client'

import {TocItem} from "@pnnh/atom";

export function TocInfo(props: { readurl: string, model: TocItem[] }) {

    return <div className={'tocCard'}>
        <div className={'tocHeader'}>
            目录信息
        </div>
        <div className={'tocBody'}>
            {
                props.model && props.model.length > 0
                    ? props.model.map((model, index) => {
                        return <div key={`toc-${index}`} className={'tocItem'}>
                            <div className={'itemHeader'} style={{paddingLeft: `${0.5 * model.header}rem`}}>
                                <a href={props.readurl + '#' + model.id} title={model.title}>{model.title}</a>
                            </div>
                        </div>
                    })
                    : '暂无'
            }
        </div>

        <style jsx>{`
            .tocCard {
                background-color: var(--background-color);
                border-radius: 4px;
                border: 1px solid var(--divider-color);
            }

            .tocHeader {
                padding: 1rem;
                border-bottom: solid 1px #e1e1e280;
            }

            .tocBody {
                padding: 1rem;
            }

            .tocItem {
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
                padding-right: 0.5rem;
                font-size: 14px;
            }

            .itemHeader {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .itemHeader :global(a) {
                color: var(--text-primary-color);
                text-decoration: none;
            }
        `}</style>
    </div>
}
