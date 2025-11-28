'use client'

import Image from "next/image";
import {useEffect, useState} from "react";
import {css} from "@emotion/css";

const goTopContainerStyle = css`
    position: fixed;
    bottom: 4rem;
    right: 4rem;
    z-index: 1000;
    cursor: pointer;
`

export function GoTop({anchor}: { anchor: string }) {
    const [show, setShow] = useState(false)
    useEffect(() => {
        const anchorElement = document.getElementById(anchor)
        if (!anchorElement) {
            return
        }
        const scrollHandler = () => {
            if (anchorElement.scrollTop > 768) {
                setShow(true)
            } else {
                setShow(false)
            }
        }
        anchorElement.addEventListener('scroll', scrollHandler)
        return () => {
            anchorElement.removeEventListener('scroll', scrollHandler)
        }
    })
    return <div style={{display: show ? 'block' : 'none'}} className={goTopContainerStyle}
                onClick={() => {
                    const anchorElement = document.getElementById(anchor)
                    if (!anchorElement) {
                        return
                    }
                    anchorElement.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                }}>
        <Image src='/icons/gotop.svg' alt='go-top' height={48} width={48}/>
    </div>
}
