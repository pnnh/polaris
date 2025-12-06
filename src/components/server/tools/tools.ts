import {ApplicationLanguageProfile, ApplicationModel} from "@/atom/common/models/tools/application";
import {localText} from "@/atom/common/language";
import {transKey, transText} from "@/components/common/locales/normal";

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

export function queryApp(expectLang: string, appUid: string): ApplicationModel | undefined {
    const apps = selectApps(expectLang)
    return apps.find(app => app.uid === appUid)
}

export function selectApps(expectLang: string): ApplicationModel[] {
    return [
        {
            uid: passwordUid,
            url: '/tools/password',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/password.webp',
            ...selectAppLangProfile(passwordUid, expectLang)
        },
        {
            uid: uuidUid,
            url: '/tools/uuid',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/uuid.webp',
            ...selectAppLangProfile(uuidUid, expectLang)
        },
        {
            uid: qrcodeUid,
            url: '/tools/qrcode',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/qrcode.webp',
            ...selectAppLangProfile(qrcodeUid, expectLang)
        },
        {
            uid: datetimeUid,
            url: '/tools/datetime',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(datetimeUid, expectLang)
        },
        {
            uid: base58Uid,
            url: '/tools/base58',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(base58Uid, expectLang)
        },
        {
            uid: base64Uid,
            url: '/tools/base64',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(base64Uid, expectLang)
        },
        {
            uid: base32Uid,
            url: '/tools/base32',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(base32Uid, expectLang)
        },
        {
            uid: highlightUid,
            url: '/tools/highlight',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(highlightUid, expectLang)
        },
        {
            uid: wejsonUid,
            url: '/tools/wejson',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(wejsonUid, expectLang)
        },
        {
            uid: md5Uid,
            url: '/tools/md5',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(md5Uid, expectLang)
        },
        {
            uid: markdownUid,
            url: '/tools/markdown',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(markdownUid, expectLang)
        },
        {
            uid: editorUid,
            url: '/tools/editor',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(editorUid, expectLang)
        },
    ]
}

function selectAppLangProfile(appUid: string, lang: string): ApplicationLanguageProfile {
    switch (appUid) {
        case passwordUid:
            return {
                lang: lang,
                name: transText(lang, '随机密码生成器', 'Random Password Generator'),
                description: transText(lang, '可以快速生成随机密码，支持自定义密码长度、密码字符集、密码数量等参数。',
                    'Quickly generate random passwords, supports custom password length, character set, number of passwords, etc.')
            }
        case uuidUid:
            return {
                lang: lang,
                name: transText(lang, 'UUID生成器', 'UUID Generator'),
                description: transText(lang, '支持常见的UUID标准，快速生成随机的UUID并复制。',
                    'Supports common UUID standards, quickly generate random UUIDs and copy them.')
            }
        case qrcodeUid:
            return {
                lang: lang,
                name: transText(lang, '二维码生成器', 'QR Code Generator'),
                description: transText(lang, '支持方便快速地生成二维码，可以自定义二维码的大小、颜色、背景色等，支持生成带logo的二维码。',
                    'Supports convenient and quick generation of QR codes, allowing customization of size, color, background color, etc., and supports generating QR codes with logos.')
            }
        case datetimeUid:
            return {
                lang: lang,
                name: transText(lang, '日期时间工具', 'Date and Time Tools'),
                description: transText(lang, '方便快捷的日期时间工具，包括时间戳转换、日期计算、日期格式化等功能。',
                    'Convenient and quick date and time tools, including timestamp conversion, date calculation, date formatting, and other functions.')
            }
        case base58Uid:
            return {
                lang: lang,
                name: transText(lang, 'Base58 编码工具', 'Base58 Encoding Tool'),
                description: transText(lang, 'Base58 编码工具可以将字符串转换为 Base58 编码格式，常用于区块链地址等场景。',
                    'Base58 encoding tool can convert strings to Base58 encoding format, commonly used in blockchain addresses and other scenarios.')
            }
        case base64Uid:
            return {
                lang: lang,
                name: transText(lang, 'Base64 编码工具', 'Base64 Encoding Tool'),
                description: transText(lang, 'Base64 编码工具可以将字符串转换为 Base64 编码格式。',
                    'Base64 encoding tool can convert strings to Base64 encoding format.')
            }
        case base32Uid:
            return {
                lang: lang,
                name: transText(lang, 'Base32 编码工具', 'Base32 Encoding Tool'),
                description: transText(lang, 'Base32 编码工具可以将字符串转换为 Base32 编码格式。',
                    'Base32 encoding tool can convert strings to Base32 encoding format.')
            }
        case highlightUid:
            return {
                lang: lang,
                name: transText(lang, '源代码高亮编码工具', 'Source Code Highlighting Tool'),
                description: transText(lang, '源代码高亮工具可以将源代码转换为高亮显示的 HTML 格式，支持多种编程语言。',
                    'Source code highlighting tool can convert source code into highlighted HTML format, supporting multiple programming languages.')
            }
        case wejsonUid:
            return {
                lang: lang,
                name: localText(lang, 'Web JSON 工具', 'Web JSON Tool'),
                description: localText(lang, 'Web JSON 工具可以处理 JSON 数据，支持格式化、验证、转换等功能。',
                    'Web JSON tool can handle JSON data, supporting formatting, validation, conversion, and other functions.')
            }
        case md5Uid:
            return {
                lang: lang,
                name: localText(lang, 'MD5 哈希工具', 'MD5 Hash Tool'),
                description: localText(lang, 'MD5 哈希工具可以计算字符串的 MD5 哈希值，常用于数据完整性校验。',
                    'MD5 hash tool can calculate the MD5 hash value of a string, commonly used for data integrity verification.')
            }
        case markdownUid:
            return {
                lang: lang,
                name: localText(lang, 'Markdown 工具', 'Markdown Tool'),
                description: localText(lang, 'Markdown 工具可以处理 Markdown 格式的文本，支持预览、转换等功能。',
                    'Markdown tool can handle Markdown formatted text, supporting preview, conversion, and other functions.')
            }
        case editorUid:
            return {
                lang: lang,
                name: transKey(lang, 'toolEditorName'),
                description: transKey(lang, 'toolEditorDesc')
            }
        default:
            return {
                lang: lang,
                name: localText(lang, '未知应用', 'Unknown Application'),
                description: localText(lang, '未知应用', 'Unknown Application')
            }
    }
}
