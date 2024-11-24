import Image from 'next/image'
import styles from './empty.module.css'

export function NoData(props: { size: 'small' | 'middle' | 'large' }) {
    let width = 100
    if (props.size === 'middle') {
        width = 200
    } else if (props.size === 'large') {
        width = 300
    }
    return <div className={styles.noData}>
        <Image src='/images/interface/nodata.jpeg' alt='empty' width={width} height={width}></Image>
    </div>
}
