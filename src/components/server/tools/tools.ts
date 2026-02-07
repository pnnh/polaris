import {useServerConfig} from "@/components/server/config";
import {psResolvePath} from "@/components/server/filesystem/path";
import fs from "node:fs";
import path from "path";
import {PSFileModel} from "@/components/common/models/file";

export const articlesUid = '019bbb53-f051-750a-8532-2358b64f31f3'
export const imagesUid = '019bbb53-ef8d-7589-aebc-851c627eabd0'
export const channelsUid = '019bbb53-ee65-7461-837a-4b1b226ac6de'
export const passwordUid = '0192e096-22e4-7aa4-8aa9-8093f09d58a7'
export const uuidUid = '0192e096-2247-7aa4-8aa9-7167ae2d1927'
export const qrcodeUid = '0192e096-21bd-7aa4-8aa9-618897c0f57d'
export const datetimeUid = '0192e096-2135-7aa4-8aa9-56f7093a900f'
export const highlightUid = '0192e096-20ba-7aa4-8aa9-4241a2e6a0fe'
export const codegenUid = '0192e096-202a-7aa4-8aa9-31282d2819df'
export const svgtoolUid = '0192e096-1f1f-7aa4-8aa9-15ff43be6898'
export const barcodeUid = '0192e570-e034-7eee-ad8a-09ce690b9ee8'
export const basexUid = '0192e097-be97-7aa4-8aa9-d0bacf336da7'
export const base58Uid = '019846ca-28c3-7103-9afc-85fa78bf82a0'
export const base64Uid = '01986ec1-9ebd-769f-8f32-7bdf9047b53b'
export const base32Uid = '01986ec8-c38a-72d9-8bd0-358d388fd11d'
export const wejsonUid = '01988d47-7faa-7739-90b3-50e2eb6760b7'
export const md5Uid = '01988db9-4938-7099-a986-9a11a5771a17'
export const markdownUid = '01988dbe-ca68-722e-9782-52587d1478a0'
export const editorUid = '019ae7ec-7d37-771a-97fb-b3a75ad406f5'
export const sha256Uid = '019b2082-4164-76eb-b9be-b99a88f2a141'
export const sha512Uid = '019b2090-217a-738a-a9bc-e76de965787e'
export const aesUid = '019b2176-8409-773d-9d64-57fd408491df'
export const rsaUid = '019b217f-6e4a-73cd-bb11-ede2f6e27297'

export async function queryApp(expectLang: string, appUid: string): Promise<PSFileModel | undefined> {
    const appList = await selectAppsFromStorage()
    return appList.find(app => app.uid === appUid)
}

export async function selectAppsFromStorage(): Promise<PSFileModel[]> {
    const serverConfig = await useServerConfig()
    const storageUrl = psResolvePath(serverConfig.STORAGE_URL)

    const resultFiles: PSFileModel[] = []
    const files = fs.readdirSync(storageUrl)
    for (const file of files) {
        const fullPath = path.join(storageUrl, file)
        const fileStat = fs.statSync(fullPath)
        const model: PSFileModel = {
            channel: "",
            create_time: "",
            creator: "",
            description: "",
            discover: 0,
            full_repo_path: "",
            image_url: "",
            is_dir: false,
            is_ignore: "",
            is_image: false,
            is_text: false,
            keywords: "",
            owner: "",
            partition: "",
            path: "",
            status: 0,
            storage_path: "",
            title: "",
            name: file,
            url: `file://${fullPath}`,
            mimetype: 'application/octet-stream',
            update_time: fileStat.mtime.toISOString(),
            uid: fileStat.ino.toString()
        }
        if (!fileStat.isDirectory()) {
            model.is_dir = true
        }
        resultFiles.push(model)

    }
    return resultFiles
}
