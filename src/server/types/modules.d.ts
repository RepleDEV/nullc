export namespace mailDB {
    export interface MailObject {
        ID: number;
        uuid: string;
        author: string;
        message: string;
        timestamp: string;
    }

    export type MailObjectArray = MailObject[];
}