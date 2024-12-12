export function pageTitle(title: string) {
    const slogan = '希波万象'
    if (!title) {
        return slogan
    }
    return `${title} - ${slogan}`
}
