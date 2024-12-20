let currentDomainPath = 'file://data'

export function serverGetDomainPath() {
    return currentDomainPath
}

export function serverSetDomainPath(event: Electron.Event, path: string) {
    currentDomainPath = path
}
