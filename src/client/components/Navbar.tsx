import React, { Component } from "react";
import { Link } from "react-router-dom";

import { disableLink } from "../modules/tools";

import "../scss/Navbar";

class Navbar extends Component {
	render(): React.ReactNode {
		return (
			<div className="navbar">
				<div className="toolbar-container">
					<div className="login-container">
						<div className="inner-login-container">
							<span className="login-link-container">
								<Link
									to="/login"
									onClick={disableLink}
									className="disabledLink">
									log in
								</Link>
							</span>
							<span className="center-border" />
							<span className="signup-link-container">
								<Link
									to="/signup"
									onClick={disableLink}
									className="disabledLink">
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
