'use client'

import React, {useEffect, useState} from "react";
import styles from './library.module.scss';
import ComputerIcon from "@mui/icons-material/Computer";
import {clientLoadLibraryEntries, IDirectoryEntry} from "@/components/client/images/service";

export function ConsoleLibraryMiddleBody({lang, portalUrl}: {
    lang: string, portalUrl: string
}) {
    const [libraries, setLibraries] = useState<IDirectoryEntry[]>()

    useEffect(() => {
        clientLoadLibraryEntries().then((dirEntries) => {
            setLibraries(dirEntries)
        }).catch((err) => {
            console.error('加载库列表失败', err)
        })


        let intervalId: any
        let msgHandler = (event: MessageEvent) => {
            console.log('Received message from SW:', event.data);

            const {type, status, timestamp} = event.data;  // Parse as needed

            if (type === 'PERIODIC_UPDATE') {
                console.log('Reply confirmed:', status, 'at', timestamp);
                // Handle the reply, e.g., update UI
            }
        }
        navigator.serviceWorker.addEventListener('message', msgHandler);

        intervalId = setInterval(() => {
            // Wait for SW to be ready (happens quickly after registration)
            navigator.serviceWorker.ready.then((registration) => {
                const activeWorker = registration.active;
                if (activeWorker) {
                    activeWorker.postMessage({
                        type: 'PERIODIC_UPDATE', data: {
                            portalUrl,
                            count: Math.random()
                        }
                    });

                    console.log('Periodic message sent to SW');
                }
            }).catch((error) => {
                console.error('SW not ready:', error);
            });
        }, 2000);

        return () => {
            // Cleanup if needed when component unmounts
            if (intervalId) {
                clearInterval(intervalId);
            }
            navigator.serviceWorker.removeEventListener('message', msgHandler)
        }
    }, []);

    if (!libraries || libraries.length === 0) {
        return <div className={styles.libBody}>
            暂无本地图片库
        </div>
    }
    return <div className={styles.libBody}>
        {libraries.map((model, index) => {
            return <ArticleCard key={index} model={model} lang={lang} portalUrl={''}/>
        })}
    </div>
}

export function ArticleCard({model, lang, portalUrl}: {
    model: IDirectoryEntry,
    lang: string,
    portalUrl: string
}) {
    return <div className={styles.libCard}>
        <ComputerIcon/>
        <a href={`/${lang}/console/images?libName=${encodeURIComponent(model.name)}`}>本地笔记库{model.name}</a>
    </div>
}
