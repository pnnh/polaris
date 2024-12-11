import {Request} from 'express'

export function getIpAddress(request: Request): string {
    let ipAddress = request.socket.remoteAddress
    for(const key in request.headers) {
        if (key.toLowerCase() === 'x-forwarded-for') {
            ipAddress = request.headers[key] as string
        } else if (key.toLowerCase() === 'x-real-ip') {
            ipAddress = request.headers[key] as string
        } else if (key.toLowerCase() === 'cf-connecting-ip') {
            ipAddress = request.headers[key] as string
        }
    }
    return String(ipAddress)
}
