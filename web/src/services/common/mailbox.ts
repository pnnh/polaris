export interface IMail {
    subject: string;
    content: string;
}

export interface IMailbox {
    sendSync(mail: IMail): unknown;
}
