import Link from 'next/link'
import styles from './link.module.css'

export function PSSTextLink (props: { children: React.ReactNode, href: string, className?: string }) {
  return <Link className={styles.textLink + (props.className ?? '')} href={props.href}>{props.children}</Link>
}
