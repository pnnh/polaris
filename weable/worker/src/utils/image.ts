export function isImage(src: string): boolean {
    if (!src) {
        return false
    }
    src = src.toLowerCase()
    return /\.(jpg|jpeg|png|gif|svg|webp)$/.test(src)
}
