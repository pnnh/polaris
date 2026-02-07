export function isErrorLike(e: any) {
    if (!e || (typeof e !== 'object' && typeof e !== 'function')) return false;

    const tag = Object.prototype.toString.call(e);
    if (
        tag === '[object Error]' ||
        tag === '[object DOMException]' // 浏览器里常见
    ) {
        return true
    }

    return (
        typeof e.message === 'string' &&
        (typeof e.name === 'string' || 'name' in e)
    );
}
