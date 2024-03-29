import React, { Component } from "react";
import { Link } from "react-router-dom";

import "../scss/Navbar";
import { EmptyComponentState } from "../types/Component";
import { Navbar as NavbarTypes } from "../types/Components";
import Popup from "./Popup";
import Heart from "./svg/Heart";
import Twitter from "./svg/Twitter";

class Navbar extends Component<NavbarTypes.NavbarProps, EmptyComponentState> {
	constructor(props: NavbarTypes.NavbarProps) {
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
					</div>
				</div>
			);
		else {
			element = (
				<Popup
					element={
						<div
							className="logout-button"
							onClick={this.props.on_log_out}>
							<span className="logout-text">log out</span>
						</div>
					}>
					<div className="user-container">
						<div className="icon-container">
							{is_mutuals ? <Heart /> : <Twitter />}
						</div>
						<div className="username-container">
							<span className="tag">@</span>
							<span className="username">{username}</span>
						</div>
					</div>
				</Popup>
			);
		}

		return (
			<div className="navbar">
				<div className="toolbar-container">{element}</div>
			</div>
		);
	}
}

export default Navbar;
