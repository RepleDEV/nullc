export namespace mailDB {
	export interface MailObject {
		ID: number;
		uuid: string;
		author: string;
		message: string;
		timestamp: string;
		tweet: 0 | 1;
	}

	export type MailObjectArray = MailObject[];
}
