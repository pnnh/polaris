// import {atom} from 'recoil'
import {PSNoteModel} from "@/models/common/personal/note";
import {PSNotebookModel} from "@/models/common/personal/notebook";
import {PSLibraryModel} from "@/models/common/personal/library";
import {createClientMailbox, IMailbox} from "@/services/client/postoffice";

// const directoryAtom = atom({
//     key: 'directoryAtom',
//     default: ''
// })

export const filesMailbox: IMailbox = createClientMailbox('files')

// const noteAtom = atom<{
//     current: PSNoteModel | undefined,
// }>({
//     key: 'noteAtom',
//     default: {
//         current: undefined,
//     }
// })

// const notebookAtom = atom<{
//     models: PSNotebookModel[],
//     current: PSNotebookModel | undefined,
// }>({
//     key: 'notebookAtom',
//     default: {
//         models: [],
//         current: undefined,
//     }
// })

// const libraryAtom = atom<{
//     models: PSLibraryModel[],
//     current: PSLibraryModel | undefined,
// }>({
//     key: 'libraryAtom',
//     default: {
//         models: [],
//         current: undefined,
//     }
// })
//
// export {noteAtom, directoryAtom, notebookAtom, libraryAtom}
