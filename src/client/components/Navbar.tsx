import React, { Component } from "react";
import { Link, To } from "react-router-dom";

import "../scss/Navbar";
import "../scss/Sidebar";
import { EmptyComponentState } from "../types/Component";
import { Navbar as NavbarTypes } from "../types/Components";
import Popup from "./Popup";
import Bars from "./svg/Bars";
import Heart from "./svg/Heart";
import Twitter from "./svg/Twitter";

class NavLink extends Component<{to: To, onClick?: () => void}> {
	render(): React.ReactNode {
		return (
			<div className="nav-link" onClick={this.props.onClick}>
				<Link to={this.props.to}>{this.props.children}</Link>
			</div>
		);
	}
}

function Links({ onClick }: { onClick?: () => void }) {
	// TODO: Wack onclick workaround pls fix
	return (
		<>
			<NavLink to="/" onClick={onClick}>home</NavLink>
			{/* <NavLink to="/repo" onClick={onClick}>tweet repo</NavLink>
			<NavLink to="/mail" onClick={onClick}>mail</NavLink> */}
		</>
	);
}

class Navbar extends Component<NavbarTypes.NavbarProps, {
	showSidebar: boolean;
}> {
	constructor(props: NavbarTypes.NavbarProps) {
		super(props);

		this.state = {
			showSidebar: false,
		};

		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	toggleSidebar() {
		this.setState({ showSidebar: !this.state.showSidebar });
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
							<Link to="/login" onClick={this.handleLogin}>
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
			<>
				<div className={`mobile-sidebar ${this.state.showSidebar && "shown"}`}>
					<div className="content">
						<Links onClick={this.toggleSidebar}/>
					</div>
					<div className="overlay-background" onClick={this.toggleSidebar}/>
				</div>
				<div className="navbar">
					<div className="bars-container" onClick={this.toggleSidebar}>
						<Bars/>
					</div>
					<Links/>
					{/* <div className="toolbar-container">{element}</div> */}
				</div>
			</>
		);
	}
}

export default Navbar;
