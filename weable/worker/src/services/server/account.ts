import {stringToBase58, stringToMd5} from "@pnnh/atom";
import {AccountModel} from "@/models/account";

export class SystemAccountService {
    async accountInformation() {
        const userSession: AccountModel = {
            uid: stringToMd5('anonymous'),
            urn: stringToBase58('anonymous'),
            create_time: '',
            update_time: '',
            username: '',
            image: '/photos/8.png',
            description: '',
            mail: '',
            nickname: 'anonymous',
            photo: '',
            role: 'anonymous',
        }
        return userSession
    }
}
