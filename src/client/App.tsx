import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Self from "./pages/Self";
import Thanks from "./pages/Thanks";
// import Login from "./pages/Login";

class App extends Component {
	constructor(props: Record<string, unknown>) {
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
