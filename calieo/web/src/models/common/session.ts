import {AccountModel} from '@/models/common/account'

export interface SessionModel {
    account: AccountModel
    name: string
    token: string
    domain: string
}
