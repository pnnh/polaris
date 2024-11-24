'use client'

import {formatRfc3339} from '@pnnh/atom'
import './table.scss'
import React from 'react'
import {PLSelectResult} from '@pnnh/polaris-business'
import {PSChannelModel} from "@pnnh/polaris-business";

export function ChannelTable(props: { data: PLSelectResult<PSChannelModel> }) {
    return <div>
        <table className={'Table'} aria-label={'simple table'}>
            <thead>
            <tr>
                <th className={'columnCheck'}>
                    <label>
                        <input type="checkbox" className="checkbox"/>
                    </label>
                </th>
                <th>标题</th>
                <th className={'columnTime'}>修改时间</th>
                <th className={'columnOperator'}>操作</th>
            </tr>
            </thead>
            <tbody>
            {
                props.data.range.map((item, index) => {
                    return <ChannelTableRow key={index} model={item}/>
                })
            }

            </tbody>
            <tfoot>
            </tfoot>

        </table>
    </div>
}

function ChannelTableRow(props: { model: PSChannelModel }) {
    const updateTimeString = formatRfc3339(props.model.update_time)
    return <tr className={'Row'}>
        <td>
            <label>
                <input type="checkbox" className="checkbox"/>
            </label>
        </td>
        <td>
            <a href={'/console/channel/update?pk=' + props.model.urn}
               title={props.model.name}>{props.model.name}</a>
        </td>
        <td>
            {updateTimeString}
        </td>
        <td>

            <DeleteButton/>

        </td>
    </tr>
}

function DeleteButton() {
    return <div>删除</div>
    // const [show, setShow] = React.useState(false)
    // const router = useRouter()
    // return <React.Fragment>
    //   <Button color={'red'} size={'xs'} onClick={() => setShow(!show)}>
    //           删除
    //   </Button>
    //   <Modal
    //     show={show}>
    //     <Modal.Header>
    //               Terms of Service
    //     </Modal.Header>
    //     <Modal.Body>
    //       <div className="space-y-6">
    //                   确定要删除吗？
    //       </div>
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button onClick={async () => {
    //         const result = await ChannelClientPresenter.deleteModel(props.pk)
    //         console.debug('result', result)
    //         if (result && result.pk) {
    //           router.refresh()
    //         }

    //         setShow(false)
    //       }}>
    //                   确定
    //       </Button>
    //       <Button
    //         color="gray"
    //         onClick={() => {
    //           console.debug('click cancel')
    //           setShow(false)
    //         }}
    //       >
    //                   取消
    //       </Button>
    //     </Modal.Footer>
    //   </Modal>
    // </React.Fragment>
}
