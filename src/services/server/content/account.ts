import {AccountModel} from "@/models/common/account";
import {stringToBase58} from "@/utils/basex";

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
