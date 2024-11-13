export function convertToNumber(value: string | number | (string | null)[] | null | undefined): number | undefined {
    const num = Number(value)
    if (isNaN(num)) {
        return undefined
    }
    return num
}
