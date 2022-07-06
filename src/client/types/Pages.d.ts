import { To } from "react-router-dom";
import { BasicComponentProps } from "./Component";

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
