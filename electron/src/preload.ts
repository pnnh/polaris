import {contextBridge, ipcRenderer} from 'electron'
import {PSNoteModel} from "@pnnh/polaris-business";

contextBridge.exposeInMainWorld('serverAPI', {
    getAppConfig: () => ipcRenderer.invoke('getAppConfig'),
    storeArticle: (article: PSNoteModel) => ipcRenderer.invoke('storeArticle', article),
    selectLibraries: () => ipcRenderer.invoke('selectLibraries'),
    selectNotebooks: (libraryUrn: string, notebookUrn: string) => ipcRenderer.invoke('selectNotebooks', libraryUrn, notebookUrn),
    selectNotes: (libraryUrn: string, notebookUrn: string, queryString: string)  => ipcRenderer.invoke('selectNotebooks',
        libraryUrn, notebookUrn, queryString),
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
