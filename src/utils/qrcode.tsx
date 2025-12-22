import QRCode from 'qrcode'

export async function textToQRCode(text: string) {
    return await QRCode.toDataURL(text, {
        width: 640,
        margin: 1
    })
}
