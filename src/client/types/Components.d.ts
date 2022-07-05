import React from "react";
import PropTypes from "prop-types";
import { To } from "react-router-dom";
import { BasicComponentProps } from "./Component";

export namespace Footer {
	export interface LinkIconProps extends BasicComponentProps {
		to: To;
		className?: string;
	}
}

export namespace Form {
	export interface FormInputProps extends BasicComponentProps {
		type: React.HTMLInputTypeAttribute | "textarea";
		onChange?: (value: string) => void;
		defaultValue?: string;
		required?: boolean;
		inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
		textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
		className?: string;
	}

	export interface FormProps extends BasicComponentProps {
		to: string;
	}
	export interface FormValueObject {
		formName: string;
		value: string;
	}
	export interface FormState {
		formValues: (FormValueObject | undefined)[];
		showInvalid: string[];
		submitState: "none" | "submitting" | "submitted";
	}
}

export namespace Navbar {
	export interface NavbarProps {
		logged_in: boolean;
		is_mutuals: boolean;
		on_log_out?: () => void;
		username?: string;
	}
}

export namespace Popup {
	export interface PopupProps extends BasicComponentProps {
		element: PropTypes.ReactNodeLike;
		edgeMargin?: number;
	}
}
