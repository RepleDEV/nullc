import React, { Component } from "react";

import PropTypes from "prop-types";

import DiscordLogo from "./svg/DiscordLogo";
import GithubMark from "./svg/GithubMark";

import Router, { Link } from "react-router-dom";

export interface LinkIconProps {
	to: Router.To;
	className?: string;
	children: PropTypes.ReactNodeLike;
}
export class LinkIcon extends Component<
	LinkIconProps,
	Record<string, unknown>
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
