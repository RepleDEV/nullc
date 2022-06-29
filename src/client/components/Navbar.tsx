import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../scss/Navbar";
import Heart from "./svg/Heart";
import Twitter from "./svg/Twitter";

interface NavbarProps {
	logged_in: boolean;
	is_mutuals: boolean;
	username?: string;
}
class Navbar extends Component<NavbarProps, Record<string, unknown>> {
	constructor(props: NavbarProps) {
		super(props);

		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin() {
		window.open("/login", "_self");
	}

	render(): React.ReactNode {
		let element = <></>;

		const { logged_in, is_mutuals, username } = this.props;

		if (!logged_in)
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
				<div className="user-container">
					<div className="icon-container">
						{
							is_mutuals ?
							<Heart /> :
							<Twitter />
						}
					</div>
					<div className="username-container">
						<span className="tag">@</span>
						<span className="username">{ username }</span>
					</div>
				</div>
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
