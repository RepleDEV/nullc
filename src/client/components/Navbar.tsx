import React, { Component } from "react";
import { Link } from "react-router-dom";

import { disableLink } from "../modules/tools";

import "../scss/Navbar";

class Navbar extends Component {
	constructor(props: Record<string, unknown>) {
		super(props);

		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin() {
		const loginWindow = window.open("/login", "", "width=800,height=600");
		if (!loginWindow)
			return;
	}

	render(): React.ReactNode {
		return (
			<div className="navbar">
				<div className="toolbar-container">
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
				</div>
			</div>
		);
	}
}

export default Navbar;
