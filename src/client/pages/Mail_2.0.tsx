import axios from "axios";
import React, { Component } from "react";
import Form, { FormInput } from "../components/Form";
import "../scss/pages/Mail"
import { BasicComponentProps } from "../types/Component";

class Mail extends Component<BasicComponentProps, {
    form: Record<string, {
        value: string;
        default?: string;
    }>;
}> {
    constructor(props: BasicComponentProps) {
        super(props);

        this.state = {
            form: {
                name: {
                    value: "Anon",
                },
                tweet: {
                    value: "no",
                },
            },
        },

        this.submit = this.submit.bind(this);
        this.onInvalid = this.onInvalid.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount() {
        const form = { ...this.state.form };
        for (const key in form) {
            const { value } = form[key];
            if (value)
                form[key].default = value;
        }

        this.setState({ form });
    }
    async submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

		// const url = "/mail";
		// await axios({
		// 	url,
		// 	method: "POST",
		// 	data: this.state.form,
		// 	headers: {
		// 		Accepts: "application/json",
		// 	},
		// });
    }
    onInvalid(event: React.FormEvent<HTMLFormElement>) {
        // TODO create custom message or sth 
        // event.preventDefault();
    }
	onChange(element: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = element.target;
        const form = { ...this.state.form };
        // Basically set value property to default if value is empty.
        // But if default is undefined, set it as "" (empty)
        const defaultValue = form[name] && form[name].default;
        form[name] = { value: value || defaultValue || "", default: defaultValue };

        this.setState({ form });
	}
    render(): React.ReactNode {
        return (
            <div className="page Mail">
                <form  className="form-container" onSubmit={this.submit} onInvalid={this.onInvalid}>
                    <div className="twin-columns">
                        <div className="column left">
                            <div className="form-input nameInput">
                                <input type="text" placeholder="Name" name="name" onChange={this.onChange}/>
                            </div>
                            <div className="form-input">
                                <div className="tweet-field-container">
                                    <span className="label">Can I tweet this?</span>
                                    <div className="radios">
                                        <label className="radio-container">
                                            <input type="radio" name="tweet" value="yes" onChange={this.onChange}/>
                                            <span className="checkmark" />
                                            <span className="text">yes</span>
                                        </label>
                                        <label className="radio-container">
                                            <input type="radio" name="tweet" value="no" onChange={this.onChange}/>
                                            <span className="checkmark" />
                                            <span className="text">no</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="warning-container">
                                Your message will be sent to null and null only. If a name isn't provided,
                                it will default to Anon. No additional data will be collected that is beyond
                                the visible form fields. Though the message(s) you send
                                is securely and safely sent and stored, never send sensitive information
                                (such as passwords) through this form.
                            </div>
                        </div>
                        <div className="column right">
                            <div className="messageInput">
                                {/* dhmu on the long ass placeholder */}
                                <textarea onChange={this.onChange} name="message" placeholder={
                                    "# Your message here!\n" +
                                    "Feel free to send me anything :D\n" +
                                    "Vents, weird facts, song requests, stuff that happened " +
                                    "throughout your day, go wild!\n" +
                                    "\n" +
                                    "## Markdown is also supported!\n" +
                                    "So your messages could be of the colours that your " +
                                    "future can never be <3\n" +
                                    "\n" +
                                    "## Please be kind ^^\n" +
                                    "Offensive messages will be hidden from null " +
                                    "so please use your words responsibly.\n" +
                                    "\n" +
                                    "With all of that said, happy writing <3"
                                } maxLength={1000} required/>
                            </div>
                            <button className="submit">submit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Mail;