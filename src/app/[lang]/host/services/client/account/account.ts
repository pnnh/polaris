import {CodeOk, PLGetResult} from "@pnnh/atom";
import {AccountModel} from "@/components/common/models/account/account";
import {clientMakeGet} from "@pnnh/atom/browser";

export async function checkLoginStatus(linkId: string) {
    try {
        const appConfig = await window.serverAPI.getAppConfig()
        const checkUrl = `${appConfig.PUBLIC_PORTAL_URL}/account/session?app=thunder&link=${linkId}`
        const response = await clientMakeGet<PLGetResult<AccountModel>>(checkUrl);
        if (response.code !== CodeOk || !response.data) {
            throw new Error(`Failed to check login status: ${response.code}`);
        }
        const userInfo = photonFillUserinfo(appConfig.PUBLIC_PORTAL_URL, response.data);
        return userInfo;
    } catch (error) {
        console.warn('Error checking login status:', error);
    }
    return null;
}

export function photonFillUserinfo(portalUrl: string, userInfo: AccountModel): AccountModel {
    if (userInfo.photo) {
        userInfo.photoUrl = userInfo.photo.startsWith('http://') || userInfo.photo.startsWith("https://") ?
            userInfo.photo : `${portalUrl}/storage${userInfo.photo}`
    }
    return userInfo
}
