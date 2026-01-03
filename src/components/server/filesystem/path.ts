export function psResolvePath(path: string) {
    let resolvedPath = path.replace(/\\/g, '/')
    if (resolvedPath.startsWith("file://")) {
        resolvedPath = resolvedPath.substring(7)
    }
    if (resolvedPath.startsWith("work/")) {
        resolvedPath = process.cwd() + "/" + resolvedPath.substring(5)
    } else if (resolvedPath.startsWith("home/")) {
        const homeDir = require('os').homedir()
        resolvedPath = homeDir + '/' + resolvedPath.substring(5)
    }
    if (process.platform === "win32") {
        resolvedPath = resolvedPath.replace(/\//g, '\\')
    } else {
        resolvedPath = resolvedPath.replace(/\\/g, '/')
    }
    return resolvedPath
}
