export function getMimeType(path: string): string {
    const mimeMap: Map<string, string> = new Map<string, string>()
    mimeMap.set('txt', 'text/plain')
    mimeMap.set('html', 'text/html')
    mimeMap.set('css', 'text/css')
    mimeMap.set('js', 'text/javascript')
    mimeMap.set('json', 'application/json')
    mimeMap.set('xml', 'application/xml')

    const ext = path.split('.').pop()
    if (!ext) {
        return 'text/plain'
    }
    return mimeMap.get(ext) || 'text/plain'
}
