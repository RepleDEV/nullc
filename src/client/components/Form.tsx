import React, { Component } from "react";

import PropTypes from "prop-types";

interface FormInputProps {
    type: React.HTMLInputTypeAttribute | "textarea";
    onChange?: (value: string) => void;
    defaultValue?: string;
    required?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    className?: string;
    children?: string;
}
class FormInput extends Component<FormInputProps, Record<string, unknown>> {
    constructor(props: FormInputProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }
    onChange(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | string) {
        if (this.props.onChange) {
            if (typeof event == "string")
                return this.props.onChange(event);
            this.props.onChange(event.target.value);
        }
    }
    render(): React.ReactNode {
        const { type, children, inputProps, textareaProps } = this.props;

        return (
            <div className={ [ "form-input", `${type}-input`].join(" ") }>
                <span className="input-title">{ children }</span>
                {
                    type === "textarea" ?
                        <textarea onChange={this.onChange} { ...textareaProps }></textarea> :
                        <input type={type} onChange={this.onChange} onClick={
                            type === "submit" ? 
                            () => {
                                this.onChange("Submit");
                            } : (_ => _)
                        }  { ...inputProps }/>
                }
            </div>
        );
    }
}

interface FormProps {
    to: string;
    children?: PropTypes.ReactNodeArray | PropTypes.ReactElementLike;
}
interface FormValueObject {
    formName: string;
    value: string;
}
interface FormState {
    formValues: ( FormValueObject | undefined )[];
    showInvalid: string[];
    submitted: boolean;
}
class Form extends Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);

        this.state = {
            formValues: [],
            showInvalid: [],
            submitted: false,
        };

        this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
        this.submit = this.submit.bind(this);
        this.getFormValueFromFormName = this.getFormValueFromFormName.bind(this);
        this.changeFormValue = this.changeFormValue.bind(this);
        this.getFormNameFromChild = this.getFormNameFromChild.bind(this);
    }
    handleInvalidSubmit(formName: string): void {
        this.setState({ showInvalid: [...this.state.showInvalid, formName] });
    }
    async submit(): Promise<void> {
        const formData = {};

        let invalidSubmit = false;

        React.Children.map(this.props.children, (child) => {
            if (React.isValidElement(child)) {
                const formName = this.getFormNameFromChild(child);

                if (formName === "submit")
                    return;

                const formValue = this.getFormValueFromFormName(formName);
                if (formValue === null && child.props.required === true) {
                    invalidSubmit = true;
                    this.handleInvalidSubmit(formName);
                } else {
                    formData[formName] = formValue || child.props.defaultValue || "";
                }
            }
        });

        if (invalidSubmit)
            return;

        const url = "/form"

        this.setState({ submitted: true });
    }
    getFormValueFromFormName(formName: string): string | null {
        for (let i = 0;i < this.state.formValues.length;i++) {
            const value = this.state.formValues[i];

            if (value && value.formName === formName)
                return value.value;
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
        const elementProps = child.props.inputProps || child.props.textareaProps;
        const formName = 
            elementProps && elementProps.name ?
                elementProps.name :
                elementProps.children;
        
        return formName;
    }
    render(): React.ReactNode {
        return (
            <div className="form-container">
                {
                    // Pass onChange prop
                    React.Children.map(this.props.children, (child, i) => {
                        if (React.isValidElement(child) && child.type === FormInput) {
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