import {IMail, IMailbox} from "@/services/common/mailbox";

const mailboxList: Map<string, IMailbox> = new Map();

export function registerComponent(name: string, component: IMailbox) {
    mailboxList.set(name, component);
}

export function getComponentValue<T>(name: string) {
    const mailbox = mailboxList.get(name);
    if (mailbox) {
        const mail: IMail = {
            subject: 'getValue',
            content: ''
        }
        return mailbox.sendSync(mail) as T;
    }
}

export function setComponentValue<T>(name: string, value: unknown) {
    const mailbox = mailboxList.get(name);
    if (mailbox) {
        const mail: IMail = {
            subject: 'setValue',
            content: value as string
        }
        mailbox.sendSync(mail);
    }
}
