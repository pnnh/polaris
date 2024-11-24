export interface IDomain {
    makeGet<T>(url: string): Promise<T>

    makePost<T>(url: string, params: unknown): Promise<T>

    assetUrl(path: string): string
}
