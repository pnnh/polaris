export function pageTitle(title: string) {
    const slogan = '希波工具集'
    if (!title) {
        return slogan
    }
    return `${title} - ${slogan}`
}
