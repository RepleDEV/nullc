import React, { Component } from "react";
import axios from "axios";

import { EmptyComponentState } from "../types/Component";
import { Form as FormTypes } from "../types/Components";

class FormInput extends Component<
	FormTypes.FormInputProps,
	EmptyComponentState
> {
	constructor(props: FormTypes.FormInputProps) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}
	onChange(
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
			| string
	) {
		if (this.props.onChange) {
			if (typeof event == "string") return this.props.onChange(event);
			this.props.onChange(event.target.value);
		}
	}
	componentDidMount() {
		// Call onChange() if initialValue is defined
		const initialValue =
			(this.props.inputProps && this.props.inputProps.value) ||
			(this.props.textareaProps && this.props.textareaProps.value);
		if (initialValue && typeof initialValue !== "object")
			this.onChange(initialValue.toString());
	}
	render(): React.ReactNode {
		const { type, children, inputProps, textareaProps } = this.props;

		return (
			<div className={["form-input", `${type}-input`].join(" ")}>
				<span className="input-title">{children}</span>
				{type === "textarea" ? (
					<textarea
						onChange={this.onChange}
						{...textareaProps}></textarea>
				) : (
					<input
						type={type}
						onChange={this.onChange}
						// onClick only if type is submit
						onClick={() =>
							type === "submit" && this.onChange("Submit")
						}
						{...inputProps}
					/>
				)}
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
		const elementProps =
			child.props.inputProps || child.props.textareaProps;
		const formName =
			elementProps && elementProps.name
				? elementProps.name
				: elementProps.children;

		return formName;
	}
	render(): React.ReactNode {
		if (this.state.submitState !== "none")
			return <FormShowStatus status={this.state.submitState} />;

		return (
			<div className="form-container">
				{
					// Pass onChange prop
					React.Children.map(this.props.children, (child, i) => {
						if (
							React.isValidElement(child) &&
							child.type === FormInput
						) {
							const formName = this.getFormNameFromChild(child);

							return React.cloneElement(child, {
								onChange: (value: string) => {
									this.changeFormValue(i, formName, value);
								},
								key: i,
							});
						}

						return child;
					})
				}
			</div>
		);
	}
}

export default Form;
export { Form, FormInput };
