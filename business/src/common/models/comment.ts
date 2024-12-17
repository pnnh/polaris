export interface CommentModel {
    urn: string;
    title?: string;
    content: string;
    create_time: string;
    update_time: string;
    creator?: string;
    thread?: string;
    referer?: string;
    domain: string;
    directory: string;
    resource: string;
    ipaddress: string;
    status: number;
}
