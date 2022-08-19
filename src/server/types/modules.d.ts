export namespace mailDB {
	export interface MailObject {
		ID: number;
		uuid: string;
		author: string;
		message: string;
		timestamp: string;
		tweet: boolean;
	}

	export type MailObjectArray = MailObject[];
}
