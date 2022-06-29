import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Self from "./pages/Self";
import Thanks from "./pages/Thanks";
import Mail from "./pages/Mail";
import axios from "axios";
// import Login from "./pages/Login";

class App extends Component<Record<string,unknown>, {
	username: string;
	logged_in: boolean;
	is_mutuals: boolean;
	admin: boolean;
}> {
	constructor(props: Record<string, unknown>) {
		super(props);

		this.state = {
			username: "",
			logged_in: false,
			is_mutuals: false,
			admin: false,
		}

		this.handleCheckLogin = this.handleCheckLogin.bind(this);
	}

	handleCheckLogin() {
		axios("/account_info").then(({ data: account_info }) => {
			this.setState({
				username: account_info.username,
				logged_in: true,
				is_mutuals: account_info.is_mutuals,
				admin: account_info.admin || false,
			});
		}).catch(() => {
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
					/>
				<main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/self" element={<Self />} />
						<Route path="/thanks" element={<Thanks />} />
						<Route path="/mail" element={<Mail />} />
						{/* <Route path="/login" element={<Login loginSuccess={() => {

						}}/>}/> */}
					</Routes>
				</main>
			</>
		);
	}
}

export default App;
