import React, { Component } from "react";
import { Link } from "react-router-dom";

import { disableLink } from "../modules/tools";

import "../scss/Navbar";

interface NavbarProps {
	logged_in: boolean;
	is_mutuals: boolean;
	username?: string;

	onFinishedLogin?: () => void;
}
class Navbar extends Component<NavbarProps, Record<string, unknown>> {
	constructor(props: NavbarProps) {
		super(props);

		this.handleLogin = this.handleLogin.bind(this);
	}

	async handleLogin() {
		const loginWindow = window.open("/login", "", "width=800,height=600");
		if (!loginWindow)
			return;
	}

	render(): React.ReactNode {
		let element = <></>;

		if (!this.props.logged_in)
			element = (
				<div className="login-container">
					<div className="inner-login-container">
						<span className="login-link-container">
							<Link to="#" onClick={this.handleLogin}>
								log in
							</Link>
						</span>
						<span className="center-border" />
						<span className="signup-link-container">
							<Link
								to="/signup">
								sign up
							</Link>
						</span>
					</div>
				</div>
			);
		else {
			element = (
				<></>
			);
		}

		return (
			<div className="navbar">
				<div className="toolbar-container">{ element }</div>
			</div>
		);
	}
}

export default Navbar;
