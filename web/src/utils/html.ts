export function encodeHtml(rawHtml: string | null | undefined): string {
    if (!rawHtml) {
        return ''
    }
    const encodedStr = rawHtml.replace(/[\u00A0-\u9999<>\&]/g, i => '&#' + i.charCodeAt(0) + ';')
    return encodedStr
}