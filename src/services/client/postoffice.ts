'use client'


const mailboxList: Map<string, IMailbox> = new Map();

export function registerComponent(component: IMailbox) {
    mailboxList.set(component.getName(), component);
}

export function unregisterComponent(component: IMailbox) {
    mailboxList.delete(component.getName());
}

export interface IMail<T> {
    subject: string;
    content: T;
}

export interface IMailbox {
    getName(): string;

    sendMail<T>(subject: string, content: T): unknown;

    sendTypedMail<T>(mail: IMail<T>): unknown;

    receiveMail<T>(subject: string): IMail<T> | undefined;

    subscribe<T>(subject: string, callback: (mail: IMail<T>) => void): Symbol;

    unsubscribe(stub: Symbol): void;
}
