import {AccountModel} from "@/business/common/models/account";
import {stringToBase58} from "@pnnh/atom";

export class SystemAccountService {
    async accountInformation() {
        const userSession: AccountModel = {
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
