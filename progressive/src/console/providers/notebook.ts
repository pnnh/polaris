
import {createClientMailbox, IMailbox} from "@pnnh/atom";

import { atom } from 'jotai'

const countAtom = atom(0)

const countryAtom = atom('Japan')

const citiesAtom = atom(['Tokyo', 'Kyoto', 'Osaka'])

export const animeAtom = atom([
    {
        title: 'Ghost in the Shell',
        year: 1995,
        watched: true
    },
    {
        title: 'Serial Experiments Lain',
        year: 1998,
        watched: false
    }
])

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
