'use server'

import {headers} from 'next/headers';

// 从请求头里获取指定名称的cookie值
// next.js的cookies()在app目录下有bug，无法获取到最新的cookie值，所以这里手动解析请求头
export async function serverGetCookie(name: string): Promise<string | null> {
    const headersList = await headers();
    const rawCookies = headersList.get('cookie') || '';
    const parts = rawCookies.split('; ').find(part => part.startsWith(`${name}=`));
    if (parts) {
        const values = parts.split('=')
        if (values.length > 1) {
            return decodeURIComponent(values[1]);
        }
    }
    return null;
}
