import {atom} from 'recoil'
import {NPLibraryModel, NPAlbumModel, NPPictureModel} from "@pnnh/venus-business";

const directoryAtom = atom({
    key: 'directoryAtom',
    default: ''
})

const pictureAtom = atom<{
    current: NPPictureModel | undefined,
}>({
    key: 'pictureAtom',
    default: {
        current: undefined,
    }
})

const albumAtom = atom<{
    models: NPAlbumModel[],
    current: NPAlbumModel | undefined,
}>({
    key: 'albumAtom',
    default: {
        models: [],
        current: undefined,
    }
})

const libraryAtom = atom<{
    models: NPLibraryModel[],
    current: NPLibraryModel | undefined,
}>({
    key: 'libraryAtom',
    default: {
        models: [],
        current: undefined,
    }
})

export {pictureAtom, directoryAtom, albumAtom, libraryAtom}

export const previewAtom = atom<{
    visible: number,
}>({
    key: 'previewAtom',
    default: {
        visible: 0,     // 0: 隐藏，1: 展示
    }
})
