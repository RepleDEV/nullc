import React, { Component, FormHTMLAttributes } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { BasicComponentProps, EmptyComponentState } from "../types/Component";
import { Form as FormTypes } from "../types/Components";

interface FormInputProps {
	onChange?: (value: string) => void;
	name: string;
	defaultValue?: string | number;
	required?: boolean;
	className?: string;
	children: (onChange: (element: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => React.ReactNode;
}
class FormInput extends Component<FormInputProps> {
	constructor(props: FormInputProps) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		if (this.props.defaultValue)
			this.onChange(this.props.defaultValue.toString());
	}
	
	onChange(element: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		if (this.props.onChange) {
			if (typeof element == "string") return this.props.onChange(element);
			this.props.onChange(element.target.value);
		}
	}

	render(): React.ReactNode {
		const { className, children } = this.props;

		return (
			<div className={`form-input ${className}`}>
				{
					typeof children === "function" ? children(this.onChange) : children
				}
			</div>
		);
	}
}

function FormShowStatus(props: { status: "submitting" | "submitted" }) {
	let text = "";
	const { status } = props;

	if (status === "submitting") text = "Submitting, please wait.";
	else text = "Submitted Mail. Thank you!";

	return (
		<div className={`form-status form-${status}`}>
			{/* TODO: Add loading animation */}
			<span className="status-text">{text}</span>
		</div>
	);
}

class Form extends Component<FormTypes.FormProps, FormTypes.FormState> {
	constructor(props: FormTypes.FormProps) {
		super(props);

		this.state = {
			formValues: [],
			showInvalid: [],
			submitState: "none",
		};

		this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
		this.submit = this.submit.bind(this);
		this.getFormValueFromFormName =
			this.getFormValueFromFormName.bind(this);
		this.changeFormValue = this.changeFormValue.bind(this);
		this.getFormNameFromChild = this.getFormNameFromChild.bind(this);
	}
	handleInvalidSubmit(formName: string): void {
		this.setState({ showInvalid: [...this.state.showInvalid, formName] });
	}
	async submit(): Promise<void> {
		const formData: Record<string, string> = {};

		let invalidSubmit = false;

		React.Children.map(this.props.children, (child) => {
			if (React.isValidElement(child)) {
				const formName = this.getFormNameFromChild(child);

				if (formName === "submit") return;

				const formValue = this.getFormValueFromFormName(formName);
				if (formValue === null && child.props.required === true) {
					invalidSubmit = true;
					this.handleInvalidSubmit(formName);
				} else {
					formData[formName] =
						formValue || child.props.defaultValue || "";
				}
			}
		});

		if (invalidSubmit) return;

		this.setState({ submitState: "submitting" });

		const url = "/mail";
		const res = await axios({
			url,
			method: "POST",
			data: formData,
			headers: {
				Accepts: "application/json",
			},
		});

		if (!res.data.error) this.setState({ submitState: "submitted" });
	}
	getFormValueFromFormName(formName: string): string | null {
		for (let i = 0; i < this.state.formValues.length; i++) {
			const value = this.state.formValues[i];

			if (value && value.formName === formName) return value.value;
		}

		return null;
	}
	changeFormValue(i: number, formName: string, value: string): void {
		if (formName === "submit" && value === "Submit") {
			this.submit();
			return;
		}

		const formValues = [...this.state.formValues];

		formValues[i] = {
			formName,
			value,
		};

		this.setState({ formValues });
	}
	getFormNameFromChild(child: React.ReactElement): string {
		return child.props.name as string;
	}
	// What the fuck typescript
	passOnChange(nodeArray: PropTypes.ReactNodeArray | PropTypes.ReactNodeLike): any {
		// Pass onChange prop
		return React.Children.map<React.ReactNode, React.ReactNode>(nodeArray, (child, i) => {
			if (React.isValidElement(child)) {
				if (child.type === FormInput) {
					const formName = this.getFormNameFromChild(child);

					return React.cloneElement(child, {
						onChange: (value: string) => {
							this.changeFormValue(i, formName, value);
						},
						key: i,
					});
				// Recursive !! idk abt the performance though
				} else if (child.props.children)
					return React.cloneElement(child, {
						children: this.passOnChange(child.props.children),
					});
			}

			return child;
		});
	}
	render(): React.ReactNode {
		if (this.state.submitState !== "none")
			return <FormShowStatus status={this.state.submitState} />;

		return (
			<div className="form-container">
				{this.passOnChange(this.props.children)}
			</div>
		);
	}
}

export default Form;
export { Form, FormInput };
