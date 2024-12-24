// 该文件中的代码是在模拟从数据库中获取数据，实际项目中应该从数据库中获取数据

import {PSApplicationModel} from "@/business/common/models/application";

const passwordUrn = '0192e096-22e4-7aa4-8aa9-8093f09d58a7'
const uuidUrn = '0192e096-2247-7aa4-8aa9-7167ae2d1927'
const qrcodeUrn = '0192e096-21bd-7aa4-8aa9-618897c0f57d'
const datetimeUrn = '0192e096-2135-7aa4-8aa9-56f7093a900f'
const highlightUrn = '0192e096-20ba-7aa4-8aa9-4241a2e6a0fe'
const codegenUrn = '0192e096-202a-7aa4-8aa9-31282d2819df'
const svgtoolUrn = '0192e096-1f1f-7aa4-8aa9-15ff43be6898'
const barcodeUrn = '0192e570-e034-7eee-ad8a-09ce690b9ee8'
const basexUrn = '0192e097-be97-7aa4-8aa9-d0bacf336da7'

export function selectApps(): PSApplicationModel[] {
    return [
        {
            urn: passwordUrn,
            url: '/tools/password',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/password.webp',
            name: '随机密码生成器',
            description: '可以快速生成随机密码，支持自定义密码长度、密码字符集、密码数量等参数。'
        },
        {
            urn: uuidUrn,
            url: '/tools/uuid',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/uuid.webp',
            name: 'UUID生成器',
            description: '支持常见的UUID标准，快速生成随机的UUID并复制。'
        },
        {
            urn: qrcodeUrn,
            url: '/tools/qrcode',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/qrcode.webp',
            name: '二维码生成器',
            description: '支持方便快速地生成二维码，可以自定义二维码的大小、颜色、背景色等，支持生成带logo的二维码。'
        },
        {
            urn: datetimeUrn,
            url: '/tools/datetime',
            update_time: '2024-10-30T12:00:00.000Z',
            image: '/images/application/datetime.webp',
            name: '日期时间工具',
            description: '方便快捷的日期时间工具，包括时间戳转换、日期计算、日期格式化等功能。'
        },
    ]
}
