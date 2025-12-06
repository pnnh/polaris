export interface PSFileModel {
    Uid: string;
    Title: string
    Name: string
    Keywords: string
    Description: string
    IsDir: boolean;
    IsHidden: boolean;
    IsIgnore: boolean;
    Size: number;
    Url: string;
    Path: string;
    CreateTime: string;
    UpdateTime: string;
    Handle: string;     // 文件操作句柄
}
