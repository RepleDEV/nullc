import React, { Component } from "react";

import DiscordLogo from "./svg/DiscordLogo";
import GithubMark from "./svg/GithubMark";

import { Link } from "react-router-dom";
import { EmptyComponentState } from "../types/Component";
import { Footer as FooterTypes } from "../types/Components";

export class LinkIcon extends Component<
	FooterTypes.LinkIconProps,
	EmptyComponentState
> {
	render(): React.ReactNode {
		const { to, className, children } = this.props;

		return (
			<Link to={to} className={`link-icon ${className || ""}`}>
				{children}
			</Link>
		);
	}
}

export default class Footer extends Component {
	render(): React.ReactNode {
		return (
			<div className="footer">
				<LinkIcon to="#">
					<GithubMark></GithubMark>
				</LinkIcon>
				<LinkIcon to="#">
					<DiscordLogo />
				</LinkIcon>
				<LinkIcon to="#">
					<img
						src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_White.png"
						alt="Spotify Icon"
					/>
				</LinkIcon>
			</div>
		);
	}
}
