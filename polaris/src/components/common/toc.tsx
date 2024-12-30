import {TocItem} from "@/models/common/toc";
import './toc.scss'

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
    </div>
}
