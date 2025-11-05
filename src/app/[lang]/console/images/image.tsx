'use client';
import React, {useEffect} from "react";
import styles from './image.module.scss';
import {
    clientGetDirectoryEntry,
    clientSyncLibraryFiles, clientRequestFilePermission,
    clientVerifyFilePermission,
    ILibraryEntry,
    IImageEntry, clientGetImageLibraryFiles
} from "@/components/client/images/service";
import Button from "@mui/material/Button";
import {NoData} from "@/components/common/empty";

export function ConsoleImageMiddleBody({libKey, lang, portalUrl}: {
    libKey: string, lang: string,
    portalUrl: string
}) {
    const [imageData, setImageData] = React.useState<IImageEntry[]>();
    const [dirEntry, setDirEntry] = React.useState<ILibraryEntry>();
    const [needPermission, setNeedPermission] = React.useState<boolean>(true);

    const loadLib = (entry: ILibraryEntry) => {
        clientGetImageLibraryFiles(entry, 20).then((data) => {
            setImageData(data);
        }).catch((err) => {
            console.error('加载图片库失败', err);
        });
    }

    let intervalId: any
    useEffect(() => {
        clientGetDirectoryEntry(libKey).then((entry) => {
            setDirEntry(entry);
            return entry
        }).then((entry) => {
            if (entry.hasPermission) {
                setNeedPermission(false);
                loadLib(entry)
            }
        }).catch((err) => {
            console.error('加载图片库目录失败', err);
        });

        intervalId = setInterval(() => {
            navigator.serviceWorker.ready.then((registration) => {
                const activeWorker = registration.active;
                if (activeWorker) {
                    activeWorker.postMessage({
                        type: 'SYNC_IMAGE_LIBRARY', data: {
                            portalUrl,
                            count: Math.random(),
                            libName: libKey,
                        }
                    });

                    console.log('Periodic message sent to SW2');
                }
            }).catch((error) => {
                console.error('SW not ready2:', error);
            });
        }, 10000);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [libKey]);

    if (!dirEntry) {
        return <div className={styles.middleBody}>
            加载图片库目录...
        </div>
    }
    if (needPermission) {
        return <div className={styles.middleBody}>
            <Button size={'small'} onClick={() => {
                clientRequestFilePermission(dirEntry).then((ok) => {
                    if (!ok) {
                        return
                    }
                    loadLib(dirEntry)
                }).catch((err) => {
                    console.error('请求文件访问权限失败', err);
                })
            }}>点击加载库内容</Button>
        </div>

    }

    if (!imageData || imageData.length === 0) {
        return <NoData size={'large'}/>
    }

    return <div className={styles.middleBody}>
        {imageData.map((model, index) => {
            return <ImageCard key={index} model={model} lang={lang} portalUrl={portalUrl}/>
        })}
    </div>
}

export function ImageCard({model, lang, portalUrl}: {
    model: IImageEntry,
    lang: string,
    portalUrl: string
}) {
    const [imgUrl, setImgUrl] = React.useState<string>('');

    useEffect(() => {
        let isMounted = true;
        model.handle.getFile().then((imgFile: Blob | MediaSource) => {
            if (isMounted) {
                const url = URL.createObjectURL(imgFile);
                setImgUrl(url);
            }
        }).catch((err: any) => {
            console.error('加载图片文件失败', err);
        });
        return () => {
            isMounted = false;
            if (imgUrl) {
                URL.revokeObjectURL(imgUrl);
            }
        }
    }, [model]);

    return <div className={styles.imageCard}>
        {imgUrl && <img src={imgUrl} alt={model.name}/>}
    </div>
}
