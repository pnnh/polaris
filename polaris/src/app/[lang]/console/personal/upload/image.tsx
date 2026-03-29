'use client';

import React, {useEffect} from "react";
import {
    clientGetDirectoryEntry,
    clientGetImageLibraryFiles,
    clientRequestFilePermission,
    IImageEntry,
    ILibraryEntry
} from "@/components/client/images/service";
import {Button} from "@/components/ui/button";
import {NoData} from "@/components/widget/empty";
import {css} from "@/gen/styled/css";

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
            if (entry.hasPermission || !entry.isLocal) {
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
        return <>
            <div className={imageStyles.middleBody}>
                加载图片库目录...
            </div>
        </>
    }
    if (dirEntry.isLocal && needPermission) {
        return <>
            <div className={imageStyles.middleBody}>
                <Button size={'sm'} variant={'ghost'} onClick={() => {
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
        </>

    }

    if (!imageData || imageData.length === 0) {
        return <NoData size={'large'}/>
    }

    return <>
        <div className={imageStyles.middleBody}>
            {imageData.map((model, index) => {
                return <ImageCard key={index} model={model} lang={lang} portalUrl={portalUrl}/>
            })}
        </div>
    </>
}

export function ImageCard({model, lang, portalUrl}: {
    model: IImageEntry,
    lang: string,
    portalUrl: string
}) {
    const [imgUrl, setImgUrl] = React.useState<string>('');

    useEffect(() => {
        let isMounted = true;
        if (model.isLocal) {

            model.handle.getFile().then((imgFile: Blob | MediaSource) => {
                if (isMounted) {
                    const url = URL.createObjectURL(imgFile);
                    setImgUrl(url);
                }
            }).catch((err: any) => {
                console.error('加载图片文件失败', err);
            });
        } else {
            setImgUrl(model.url || '');
        }
        return () => {
            isMounted = false;
            if (model.isLocal && imgUrl) {
                URL.revokeObjectURL(imgUrl);
            }
        }
    }, [model]);

    return <>
        <div className={imageStyles.imageCard}>
            {imgUrl && <img src={imgUrl} alt={model.name}/>}
        </div>
    </>
}

const imageStyles = {
    middleBody: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        width: 100%;
    `,
    imageCard: css`
        border: solid 1px #E0E0E0;
        border-radius: 8px;
        padding: 1rem;
        background-color: var(--background-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        & img {
            height: 4rem;
            width: 4rem;
            object-fit: cover;
        }
    `
}
