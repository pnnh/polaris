
import {createClientMailbox, IMailbox} from "@pnnh/atom";

// export const noteAtom = atom<{
//     current: PSFileModel | undefined,
// }>({
//     key: 'noteAtom',
//     default: {
//         current: undefined,
//     }
// })
//
// export const filesAtom = atom<{
//     models: PSFileModel[],
// }>({
//     key: 'filesAtom',
//     default: {
//         models: [],
//     }
// })
//
// export const libraryListAtom = atom<{
//     models: PSFileModel[]
// }>({
//     key: 'libraryListAtom',
//     default: {
//         models: [],
//     }
// })
//
// export const libraryAtom = atom<{
//     current: PSFileModel | undefined,
// }>({
//     key: 'libraryAtom',
//     default: {
//         current: undefined,
//     }
// })


export const filesMailbox: IMailbox = createClientMailbox('files')
