import {contextBridge, ipcRenderer} from 'electron'
import {ISelectFilesOptions, PSNoteModel} from "@pnnh/polaris-business";

contextBridge.exposeInMainWorld('serverAPI', {
    getAppConfig: () => ipcRenderer.invoke('getAppConfig'),
    storeArticle: (article: PSNoteModel) => ipcRenderer.invoke('storeArticle', article),
    selectFiles: (parentPath: string, options: ISelectFilesOptions | undefined) => ipcRenderer.invoke('selectFiles',
        parentPath, options),
    getDomainPath: () => ipcRenderer.invoke('getDomainPath'),
    setDomainPath: (path: string) => ipcRenderer.invoke('setDomainPath', path)
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type] ?? 'unknown')
    }
})
