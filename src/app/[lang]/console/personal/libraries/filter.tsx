'use client'

import styles from "./filter.module.scss";
import React from "react";
import {transKey} from "@/components/common/locales/normal";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import {clientOpenImageLibrary} from "@/components/client/images/service";

export function ConsoleLibraryFilterBar({lang, keyword, portalUrl}: {
    lang: string,
    keyword: string, portalUrl: string
}) {
    const [searchText, setSearchText] = React.useState(keyword || '');
    const goSearch = () => {
        console.debug('go search', searchText);
    }
    const goCreateArticle = () => {
        clientOpenImageLibrary().then(entry => {
            console.log('selected files', entry);

            navigator.serviceWorker.ready.then((registration) => {
                const activeWorker = registration.active;
                if (activeWorker) {
                    activeWorker.postMessage({
                        type: 'SYNC_IMAGE_LIBRARY', data: {
                            portalUrl,
                            count: Math.random(),
                            libName: entry.key,
                        }
                    });

                    console.log('Periodic message sent to SW2');
                }
            }).catch((error) => {
                console.error('SW not ready2:', error);
            });

        }).catch(error => {
            console.error('select files error', error);
        })
    }
    return <div className={styles.middleTop}>
        <div className={styles.topLeft}>
            <Button size={'small'} variant={'contained'} onClick={goCreateArticle}>
                打开图片目录
            </Button>
        </div>
        <div className={styles.topRight}>
            <div className={styles.searchBox}>
                <input placeholder={transKey(lang, "searchPlaceholder")} maxLength={128} value={searchText}
                       onChange={(event) => setSearchText(event.target.value)}
                       onKeyDown={(event) => {
                           if (event.key === 'Enter') {
                               goSearch()
                           }
                       }}/>
                <SearchIcon fontSize={'small'} onClick={goSearch}/>
            </div>
        </div>
    </div>
}
