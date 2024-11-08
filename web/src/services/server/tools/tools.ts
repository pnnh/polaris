import {isProd} from "@/services/server/config";
import {ApplicationLanguageProfile, ApplicationModel} from "@/models/common/tools/application";
import {getActualLang, isEn, isZh} from "@/services/server/i18n";

// 该文件中的代码是在模拟从数据库中获取数据，实际项目中应该从数据库中获取数据

const passwordUrn = '0192e096-22e4-7aa4-8aa9-8093f09d58a7'
const uuidUrn = '0192e096-2247-7aa4-8aa9-7167ae2d1927'
const qrcodeUrn = '0192e096-21bd-7aa4-8aa9-618897c0f57d'
const datetimeUrn = '0192e096-2135-7aa4-8aa9-56f7093a900f'
const highlightUrn = '0192e096-20ba-7aa4-8aa9-4241a2e6a0fe'
const codegenUrn = '0192e096-202a-7aa4-8aa9-31282d2819df'
const svgtoolUrn = '0192e096-1f1f-7aa4-8aa9-15ff43be6898'
const barcodeUrn = '0192e570-e034-7eee-ad8a-09ce690b9ee8'
const basexUrn = '0192e097-be97-7aa4-8aa9-d0bacf336da7'

export function selectApps(expectLang: string): ApplicationModel[] {
    return [
        {
            urn: passwordUrn,
            url: isProd() ? 'https://password.calieo.xyz' : 'http://127.0.0.1:8003',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/password.webp',
            ...selectAppLangProfile(passwordUrn, expectLang)
        },
        {
            urn: uuidUrn,
            url: isProd() ? 'https://uuid.calieo.xyz' : 'http://127.0.0.1:8002',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/uuid.webp',
            ...selectAppLangProfile(uuidUrn, expectLang)
        },
        {
            urn: qrcodeUrn,
            url: isProd() ? 'https://uuid.calieo.xyz' : 'http://127.0.0.1:8002',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/qrcode.webp',
            ...selectAppLangProfile(qrcodeUrn, expectLang)
        },
        {
            urn: datetimeUrn,
            url: isProd() ? 'https://uuid.calieo.xyz' : 'http://127.0.0.1:8002',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            ...selectAppLangProfile(datetimeUrn, expectLang)
        },
        {
            urn: highlightUrn,
            url: isProd() ? 'https://uuid.calieo.xyz' : 'http://127.0.0.1:8002',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/highlight.webp',
            ...selectAppLangProfile(highlightUrn, expectLang)
        },
        {
            urn: codegenUrn,
            url: isProd() ? 'https://uuid.calieo.xyz' : 'http://127.0.0.1:8002',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/codegen.webp',
            ...selectAppLangProfile(codegenUrn, expectLang)
        },
        {
            urn: svgtoolUrn,
            url: isProd() ? 'https://uuid.calieo.xyz' : 'http://127.0.0.1:8002',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/svgtool.webp',
            ...selectAppLangProfile(svgtoolUrn, expectLang)
        },
        {
            urn: barcodeUrn,
            url: isProd() ? 'https://uuid.calieo.xyz' : 'http://127.0.0.1:8002',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/barcode.webp',
            ...selectAppLangProfile(barcodeUrn, expectLang)
        },
        {
            urn: basexUrn,
            url: isProd() ? 'https://uuid.calieo.xyz' : 'http://127.0.0.1:8002',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/basex.webp',
            ...selectAppLangProfile(basexUrn, expectLang)
        }
    ]
}

function selectAppLangProfile(appUrn: string, expectLang: string): ApplicationLanguageProfile {
    const actualLang = getActualLang(expectLang)
    switch (appUrn) {
        case passwordUrn:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: '随机密码生成器',
                description: '可以快速生成随机密码，支持自定义密码长度、密码字符集、密码数量等参数。'
            } : {
                lang: actualLang,
                name: 'Password Generator',
                description: 'Quickly generate random passwords, support custom password length, password character set, password quantity, etc.'
            }
        case uuidUrn:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: 'UUID生成器',
                description: '支持常见的UUID标准，快速生成随机的UUID并复制。'
            } : {
                lang: actualLang,
                name: 'UUID Generator',
                description: 'Support common UUID standards, quickly generate random UUID and copy.'
            }
        case qrcodeUrn:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: '二维码生成器',
                description: '支持方便快速地生成二维码，可以自定义二维码的大小、颜色、背景色等，支持生成带logo的二维码。'
            } : {
                lang: actualLang,
                name: 'QR Code Generator',
                description: 'Supports convenient and fast generation of QR codes, can customize the size, color, background color of the QR code, and supports the generation of QR codes with logo.'
            }
        case datetimeUrn:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: '日期时间工具',
                description: '方便快捷的日期时间工具，包括时间戳转换、日期计算、日期格式化等功能。'
            } : {
                lang: actualLang,
                name: 'Date Time Tool',
                description: 'Convenient and fast date and time tool, including timestamp conversion, date calculation, date formatting and other functions.'
            }
        case highlightUrn:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: '源代码高亮',
                description: '支持对常见编程语言代码高亮显示、代码格式化、选择高亮风格并导出图片等。'
            } : {
                lang: actualLang,
                name: 'Source Code Highlight',
                description: 'Supports highlighting common programming language code, code formatting, selecting highlight styles and exporting images.'
            }
        case codegenUrn:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: '代码生成器',
                description: '自定义业务模型，根据业务模型快速生成各个编程语言模型代码，和常规校验逻辑。'
            } : {
                lang: actualLang,
                name: 'Code Generator',
                description: 'Customize the business model, quickly generate various programming language model codes and regular verification logic according to the business model.'
            }
        case svgtoolUrn:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: 'SVG预览工具',
                description: '支持预览SVG代码，调整SVG大小、颜色、背景色等，支持导出SVG图片。'
            } : {
                lang: actualLang,
                name: 'SVG Preview Tool',
                description: 'Support preview of SVG code, adjust SVG size, color, background color, etc., support export of SVG images.'
            }
        case barcodeUrn:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: '条形码工具',
                description: '基于文本生成条形码并导出图片。'
            } : {
                lang: actualLang,
                name: 'Barcode Tool',
                description: 'Generate barcodes based on text and export images.'
            }
        case basexUrn:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: 'Base64系列工具',
                description: '支持Base32、Base64等常见Base家族系列的编码与解码，支持文件编码与解码，支持不同的文本编码。'
            } : {
                lang: actualLang,
                name: 'Base64 Series Tool',
                description: 'Support encoding and decoding of common Base family series such as Base32, Base64, support file encoding and decoding, and support different text encoding.'
            }
        default:
            return isZh(actualLang) ? {
                lang: actualLang,
                name: '未知应用',
                description: '未知应用'
            } : {
                lang: actualLang,
                name: 'Unknown Application',
                description: 'Unknown Application'
            }
    }
}
