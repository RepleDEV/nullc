import React, { Component } from "react";
import { Link } from "react-router-dom";

import GOL, { Cell } from "../scripts/gol";

// SVG imports
import Heart from "../components/svg/Heart";
import Circle from "../components/svg/Circle";
import Mail from "../components/svg/Mail";

import "../scss/pages/Home";

import { EmptyComponentState } from "../types/Component";
import { Home } from "../types/Pages";

interface HomeBackgroundStates {
	cells: Cell[];
	continueGeneration: boolean;
}
// eslint-disable-next-line
class HomeBackground extends Component<
	Record<string, unknown>,
	HomeBackgroundStates
> {
	_gol_instance: GOL | null = null;

	_cellAmountX = 100;
	_cellAmountY = 32;

	constructor(props: Record<string, unknown>) {
		super(props);

		// this._handleNewGeneration = this._handleNewGeneration.bind(this);

		this.state = {
			cells: [],
			continueGeneration: false,
		};
	}
	componentDidMount(): void {
		// const cells: Cell[] = [];
		// const cellRandomAmount = this._cellAmountX * this._cellAmountY * .30;
		// for (let i = 0;i < cellRandomAmount;i++) {
		//     const randX = Math.floor(Math.random() * this._cellAmountX);
		//     const randY = Math.floor(Math.random() * this._cellAmountY);
		//     cells.push({ x: randX, y: randY });
		// }
	}
	// _handleNewGeneration(t = 1000) {}
	render(): React.ReactNode {
		const { cells } = this.state;
		const cellElms: JSX.Element[] = [];

		const { _cellAmountX, _cellAmountY } = this;
		const cellWidth = window.innerWidth / _cellAmountX;

		for (const { x, y } of cells) {
			// Check if within borders
			if (
				x >= this._cellAmountX ||
				y >= this._cellAmountY ||
				x < 0 ||
				y < 0
			)
				continue;

			cellElms.push(
				<div
					className="cell"
					style={{
						transform: `translate(${x * cellWidth}px, ${
							y * cellWidth
						}px)`,
						width: `${cellWidth}px`,
						height: `${cellWidth}px`,
					}}
					key={x + ":" + y}
				/>
			);
		}

		return (
			<div
				className="background-container"
				style={{
					height: `${cellWidth * _cellAmountY}px`,
				}}>
				{...cellElms}
			</div>
		);
	}
}

class MainLink extends Component<Home.MainLinkProps, EmptyComponentState> {
	render(): React.ReactNode {
		const { to, icon, className, onClick, children } = this.props;

		return (
			<Link to={to} className="link" onClick={onClick}>
				<div className={`outer-link-container ${className || ""}`}>
					<div className="icon-container">{icon}</div>
					<div className="link-container">
						<span>{children}</span>
					</div>
				</div>
			</Link>
		);
	}
}

class Home extends Component {
	render(): React.ReactNode {
		return (
			<div className="page Home">
				{/* TODO: DON'T FORGET TO COME BACK TO THIS */}
				{/* <HomeBackground /> */}
				<div className="mainLinksOuterContainer">
					<div className="mainLinksContainer">
						<MainLink to="/self" icon={<Circle />}>
							about me
						</MainLink>
						<MainLink to="/thanks" icon={<Heart />}>
							special thanks
						</MainLink>
						<MainLink to="/mail" icon={<Mail />}>
							Mail
						</MainLink>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
