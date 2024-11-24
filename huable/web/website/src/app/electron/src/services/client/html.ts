export function htmlEncode(text: string) {
    const div = document.createElement('div')
    div.appendChild(document.createTextNode(text))
    return div.innerHTML
}

export function htmlDecode(text: string) {
    const div = document.createElement('div')
    div.innerHTML = text
    return div.innerText || div.textContent
}