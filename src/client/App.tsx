import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Self from "./pages/Self";
import Thanks from "./pages/Thanks";
import Mail from "./pages/Mail";
import axios from "axios";

import { BasicComponentProps } from "./types/Component";
import { AppState } from "./types/App";

class App extends Component<BasicComponentProps, AppState> {
	constructor(props: BasicComponentProps) {
		super(props);

		this.state = {
			username: "",
			logged_in: false,
			is_mutuals: false,
			admin: false,
		};

		this.handleLogOut = this.handleLogOut.bind(this);
		this.handleCheckLogin = this.handleCheckLogin.bind(this);
	}

	handleLogOut() {
		axios({
			method: "POST",
			url: "/logout",
		})
			.then(() => {
				this.setState({
					logged_in: false,
					is_mutuals: false,
					admin: false,
					username: "",
				});
			})
			.catch(() => {
				console.log("Logout unauthorized!");
			});
	}

	handleCheckLogin() {
		axios("/account_info")
			.then(({ data: account_info }) => {
				this.setState({
					username: account_info.username,
					logged_in: true,
					is_mutuals: account_info.is_mutuals,
					admin: account_info.admin || false,
				});
			})
			.catch(() => {
				console.log("Login info unauthorized. Continuing.");
			});
	}

	componentDidMount() {
		this.handleCheckLogin();
	}

	render(): React.ReactNode {
		return (
			<>
				<Navbar
					logged_in={this.state.logged_in}
					is_mutuals={this.state.is_mutuals}
					username={this.state.username}
					on_log_out={this.handleLogOut}
				/>
				<main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/self" element={<Self />} />
						<Route path="/thanks" element={<Thanks />} />
						<Route
							path="/mail"
							element={
								<Mail
									logged_in={this.state.logged_in}
									username={this.state.username}
									admin={this.state.admin}
								/>
							}
						/>
					</Routes>
				</main>
			</>
		);
	}
}

export default App;
