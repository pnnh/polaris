import {stringToBase58, stringToMd5} from "@/utils/basex";
import {AccountModel} from "@pnnh/polaris-business";

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
