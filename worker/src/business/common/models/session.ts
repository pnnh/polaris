import {AccountModel} from '@/business/common/models/account'

export interface SessionModel {
    account: AccountModel
    name: string
    token: string
    domain: string
}
