import React from "react";

import DiscordLogo from "./svg/DiscordLogo";
import GithubMark from "./svg/GithubMark";

import { Link } from "react-router-dom";
import { Footer as FooterTypes } from "../types/Components";

export function LinkIcon(props: FooterTypes.LinkIconProps) {
		const { to, className, children } = props;

	return (
		<Link to={to} className={`link-icon ${className || ""}`}>
			{children}
		</Link>
	);
}

export default function Footer() {
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
