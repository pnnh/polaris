import {AccountModel} from '@/models/account'

export interface SessionModel {
    account: AccountModel
    name: string
    token: string
    domain: string
}
