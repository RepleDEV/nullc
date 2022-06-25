import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Self from "./pages/Self";
import Thanks from "./pages/Thanks";
import Login from "./pages/Login";

interface AppProps {}
interface AppStates {}
class App extends Component<AppProps, AppStates> {
	constructor(props: AppProps) {
		super(props);
	}

	render(): React.ReactNode {
		return (
			<>
				<Navbar />
				<main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/self" element={<Self />} />
						<Route path="/thanks" element={<Thanks />} />
						{/* <Route path="/login" element={<Login loginSuccess={() => {

						}}/>}/> */}
					</Routes>
				</main>
			</>
		);
	}
}

export default App;
