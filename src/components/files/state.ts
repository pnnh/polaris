import {atom} from 'jotai'
import {PSFileModel} from "@/components/common/models/file";

export const filePreviewAtom = atom<PSFileModel | undefined>(undefined)


