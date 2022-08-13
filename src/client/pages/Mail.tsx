import React, { Component } from "react";
import PageReturn from "../components/PageReturn";
import Form, { FormInput } from "../components/Form";
import { Mail as MailTypes } from "../types/Pages";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

import { mailDB } from "../../server/types/modules";

import "../scss/pages/Mail.scss";
import { BasicComponentProps, EmptyComponentState } from "../types/Component";

class MailCard extends Component<
	mailDB.MailObject & BasicComponentProps,
	EmptyComponentState
> {
	render(): React.ReactNode {
		const { author, message, timestamp } = this.props;
		return (
			<div className="mail-card">
				<div className="author">{author}</div>
				<div className="message">{message}</div>
				<div className="timestamp">
					{dayjs(timestamp)
						.tz(dayjs.tz.guess())
						.format("HH:mm dddd, DD MMM YYYY")}
				</div>
			</div>
		);
	}
}

class MailAdmin extends Component<
	BasicComponentProps,
	MailTypes.MailAdminState
> {
	constructor(props: BasicComponentProps) {
		super(props);

		this.state = {
			mail_data: [],
		};
	}
	async componentDidMount() {
		const mail_data = (await (
			await fetch("/mail_data")
		).json()) as mailDB.MailObjectArray;

		this.setState({ mail_data });
	}
	render(): React.ReactNode {
		return (
			<div className="mail-admin-container">
				{[...this.state.mail_data].map((mail) => {
					return <MailCard {...mail} key={mail.uuid} />;
				})}
			</div>
		);
	}
}

class Mail extends Component<MailTypes.MailProps> {
	render(): React.ReactNode {
		return (
			<div className="page Mail">
				<PageReturn />
				{this.props.admin ? (
					<MailAdmin />
				) : (
					<Form to="/">
						<FormInput
							type="text"
							defaultValue="Anon"
							inputProps={{
								placeholder: "Anon",
								name: "name",
								value: this.props.username,
							}}>
							Name
						</FormInput>
						<FormInput
							type="textarea"
							required
							textareaProps={{
								placeholder: "What's on your mind?",
								name: "message",
								maxLength: 500,
							}}>
							Message
						</FormInput>
						<FormInput
							type="submit"
							inputProps={{
								value: "Submit",
								name: "submit",
							}}></FormInput>
					</Form>
				)}
			</div>
		);
	}
}

export default Mail;
