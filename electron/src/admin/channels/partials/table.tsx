'use client'

import {formatRfc3339} from '@pnnh/atom'
import styles from './table.module.scss'
import React from 'react'
import Link from 'next/link'
import {PLSelectResult} from '@pnnh/polaris-business'
import {PSChannelModel} from "@pnnh/polaris-business";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export function ChannelTable(props: { data: PLSelectResult<PSChannelModel> }) {
    return <TableContainer>
        <Table className={styles.Table} aria-label={'simple table'}>
            <TableHead>
                <TableRow>
                    <TableCell className={styles.columnCheck}>
                        <label>
                            <input type="checkbox" className="checkbox"/>
                        </label>
                    </TableCell>
                    <TableCell>标题</TableCell>
                    <TableCell className={styles.columnTime}>修改时间</TableCell>
                    <TableCell className={styles.columnOperator}>操作</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    props.data.range.map((item, index) => {
                        return <ChannelTableRow key={index} model={item}/>
                    })
                }

            </TableBody>
            <tfoot>
            </tfoot>

        </Table>
    </TableContainer>
}

function ChannelTableRow(props: { model: PSChannelModel }) {
    const updateTimeString = formatRfc3339(props.model.update_time)
    return <TableRow className={styles.Row}>
        <TableCell>
            <label>
                <input type="checkbox" className="checkbox"/>
            </label>
        </TableCell>
        <TableCell>
            <Link href={'/console/channel/update?pk=' + props.model.uid}
                  title={props.model.name}>{props.model.name}</Link>
        </TableCell>
        <TableCell>
            {updateTimeString}
        </TableCell>
        <TableCell>

            <DeleteButton/>

        </TableCell>
    </TableRow>
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
