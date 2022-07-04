import React, { Component } from "react";

import { MutualInfo } from "../../../public/moots_list";

import PageReturn from "../components/PageReturn";
import Heart from "../components/svg/Heart";

import "../scss/pages/Thanks";
import { BasicComponentProps, EmptyComponentState } from "../types/Component";
import * as Pages from "../types/Pages";

class MootsCell extends Component<Pages.Thanks.MootsCellProps, EmptyComponentState> {
	render(): React.ReactNode {
		const { header, icon, username } = this.props;
		return (
			<div className={`moots-cell ${header.length ? "" : "no-header"}`}>
				<div className="header-container">
					<img src={header} alt="Header Image" />
				</div>
				<div className="icon-container">
					<img src={icon} alt="Icon Image" />
				</div>
				<div className="username-container">
					<span className="username-tag">@</span>
					<span className="username">{username}</span>
				</div>
			</div>
		);
	}
}

class MootsList extends Component<BasicComponentProps, Pages.Thanks.MootsListState> {
	constructor(props: Record<string, unknown>) {
		super(props);

		this.getMootsList = this.getMootsList.bind(this);
		this.getMootsListDEV = this.getMootsListDEV.bind(this);

		this.state = {
			mootsList: [],
		};
	}
	async getMootsList(): Promise<MutualInfo[]> {
		const moots_list = (await fetch("moots_list.json")).json();

		return moots_list;
	}
	async getMootsListDEV(): Promise<MutualInfo[]> {
		return new Promise((res) => {
			res([
				{
					id: "1481400149842997248",
					header: "https://pbs.twimg.com/profile_banners/1481400149842997248/1655711362/1500x500",
					icon: "https://pbs.twimg.com/profile_images/1538791097165488128/7dkaS8Da_400x400.jpg",
					username: "nullluvsu",
				},
			]);
		});
	}
	async componentDidMount() {
		const mootsList = await this.getMootsList();

		this.setState({ mootsList });
	}
	render(): React.ReactNode {
		const { mootsList } = this.state;

		return (
			<div className="row-container moots-list">
				{[...mootsList].map(({ header, icon, username }) => {
					return (
						<MootsCell
							header={header}
							icon={icon}
							username={username}
							key={username}
						/>
					);
				})}
			</div>
		);
	}
}

export default class Thanks extends Component {
	render(): React.ReactNode {
		return (
			<div className="page Thanks">
				<PageReturn />
				<div className="row-container thank-you-container">
					<div className="heart-container">
						<Heart />
					</div>
					<span>to all my mootie patooties</span>
				</div>
				<MootsList />
			</div>
		);
	}
}
