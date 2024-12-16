import {atom} from 'recoil'
import {PSLibraryModel, PSNotebookModel, PSNoteModel} from "@pnnh/polaris-business";

const directoryAtom = atom({
    key: 'directoryAtom',
    default: ''
})

const noteAtom = atom<{
    current: PSNoteModel | undefined,
}>({
    key: 'noteAtom',
    default: {
        current: undefined,
    }
})

const notebookAtom = atom<{
    models: PSNotebookModel[],
    current: PSNotebookModel | undefined,
}>({
    key: 'notebookAtom',
    default: {
        models: [],
        current: undefined,
    }
})

const libraryAtom = atom<{
    models: PSLibraryModel[],
    current: PSLibraryModel | undefined,
}>({
    key: 'libraryAtom',
    default: {
        models: [],
        current: undefined,
    }
})

export {noteAtom, directoryAtom, notebookAtom, libraryAtom}
