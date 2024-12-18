import {atom} from 'recoil'
import {SessionModel} from "@pnnh/polaris-business";

const sessionAtom = atom<SessionModel>({
    key: 'session',
    default: {
        account: {
            uid: '',
            username: '',
            create_time: '',
            update_time: '',
            image: '',
            description: '',
            mail: '',
            nickname: '',
            photo: '',
            urn: '',
            role: '',
        },
        token: '',
        name: '',
        domain: '',
    }
})

export {sessionAtom}
