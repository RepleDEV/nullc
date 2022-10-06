import { To } from "react-router-dom";
import { BasicComponentProps } from "./Component";
import { mailDB } from "../../server/types/modules";

import { MutualInfo } from "../../../public/moots_list";

export namespace Home {
	export interface MainLinkProps extends BasicComponentProps {
		to: To;
		icon: React.ReactNode;
		className?: string;
		onClick?: (
			event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
		) => void;
	}
}

export namespace Mail {
	export interface SubmittingProps extends BasicComponentProps {
		data: any;
		catch?: () => void;
		finally?: () => void;
	}

	export interface SubmittingState {
		message: string;
		sent: boolean;
	}
	
	export interface MailState {
		form: Record<string, {
			value: string;
			default?: string;
		}>;
		data: Record<string, string>;
		submitting: boolean;
	}

	export interface MailAdminState {
		mail_data: mailDB.MailObjectArray;
	}

	export interface MailProps extends BasicComponentProps {
		logged_in?: boolean;
		username?: string;
		admin?: boolean;
	}
}

export namespace Self {
	export interface BulletRowProps extends BasicComponentProps {
		bulletStyle?: "line" | "dot";
	}
}

export namespace Thanks {
	export interface MootsCellProps {
		header: string;
		icon: string;
		username: string;
	}

	export interface MootsListState {
		mootsList: MutualInfo[];
	}
}
