import {AccountModel} from "@/atom/common/models/account";

export function photonFillUserinfo(portalUrl: string, userInfo: AccountModel): AccountModel {
    if (userInfo.photo) {
        userInfo.photoUrl = userInfo.photo.startsWith('http://') || userInfo.photo.startsWith("https://") ?
            userInfo.photo : `${portalUrl}/storage${userInfo.photo}`
    }
    return userInfo
}
