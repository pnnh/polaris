import {atom} from "jotai";
import {PSArticleModel} from "@/components/common/models/article";
import {PSNotebookModel} from "@/components/common/models/personal/notebook";
import {PSLibraryModel} from "@/components/client/libraries/library";

const directoryAtom = atom({
    key: 'directoryAtom',
    default: ''
})

const noteAtom = atom<{
    current: PSArticleModel | undefined,
}>({
    current: undefined,
})

const notebookAtom = atom<{
    models: PSNotebookModel[],
    current: PSNotebookModel | undefined,
}>({
    models: [],
    current: undefined,
})

const libraryAtom = atom<{
    models: PSLibraryModel[],
    current: PSLibraryModel | undefined,
}>({
    models: [],
    current: undefined,
})

export {noteAtom, directoryAtom, notebookAtom, libraryAtom}
