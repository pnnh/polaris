import {uuidToBase58} from "@pnnh/atom";
import {EmptyUUID} from "@pnnh/atom";

export interface AccountModel {
    uid: string
    create_time: string
    update_time: string
    username: string
    image: string
    introduction: string        // 简短介绍
    description: string
    mail: string
    nickname: string
    photo: string
    photoUrl: string
    role: string
}

export function isValidAccountModel(model: any): model is AccountModel {
    return model && typeof model === 'object' &&
        typeof model.uid === 'string' &&
        typeof model.create_time === 'string' &&
        typeof model.update_time === 'string' &&
        typeof model.username === 'string' &&
        typeof model.image === 'string' &&
        typeof model.description === 'string' &&
        typeof model.mail === 'string' &&
        typeof model.nickname === 'string' &&
        typeof model.photo === 'string' &&
        typeof model.role === 'string';
}

export const anonymousAccountUid = EmptyUUID;
export const anonymousAccount: AccountModel = {
    uid: anonymousAccountUid,
    create_time: '',
    update_time: '',
    username: 'anonymous',
    image: '',
    introduction: '',
    description: '',
    mail: '',
    nickname: '匿名用户',
    photo: '',
    photoUrl: '',
    role: 'anonymous'
}

export function isAnonymousAccount(model: AccountModel | undefined | null | unknown): boolean {
    if (!model || typeof model !== 'object') return false;
    const modelUid = (model as any).uid;
    if (typeof modelUid !== 'string') return false;
    return modelUid === anonymousAccountUid;
}

export function getAccountUrn(uid: string): string {
    if (!uid || uid.length === 0 || uid === anonymousAccountUid) {
        return `anonymous`
    }
    return uuidToBase58(uid)
}
