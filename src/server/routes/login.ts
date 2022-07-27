import { Router } from "express";
import axios from "axios";
import { TwitterApi } from "twitter-api-v2";
import CodeChallenge from "../modules/codeChallenge";
import { URLSearchParams } from "url";

import getRedirectUri from "../modules/getRedirectUri";

import "../../../.env.d";

const router = Router();

router.get("/callback", async (req, res) => {
	const code = req.query.code as string | undefined;
	if (req.query.code) {
		const { code_verifier } = req.session;
		if (!code_verifier) {
			return res.redirect("/");
		}
		const response = await axios({
			method: "POST",
			url: "https://api.twitter.com/2/oauth2/token",
			params: {
				code,
				grant_type: "authorization_code",
				client_id: process.env.TWITTER_CLIENT_ID || "",
				redirect_uri: getRedirectUri(),
				code_verifier: req.session.code_verifier || "",
			},
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		const access_token = response.data.access_token as string;
		req.session.access_token = access_token;

		const client = new TwitterApi(access_token);
		const { data: me } = await client.v2.me({
			"user.fields": ["public_metrics"],
		});

		let is_mutuals = false;

		req.session.logged_in = true;

		// TODO: CHANGE THIS TO MY ID WTF ?!?!?!
		// TODO: OR MOVE THIS CHECK TO .ENV
		if (process.env.NODE_ENV !== "production" || me.username === "hrtsforlin") {
			req.session.admin = true;

			req.session.account_info = {
				username: me.username,
				is_mutuals: true,
			};
		} else {
			// TODO: This shit O(n) pls fix
			// TODO: Along with 2 async requests huh
			const follower_count = me.public_metrics?.followers_count || 1000;

			const params = {
				max_results: follower_count > 1000 ? 1000 : follower_count,
			};

			const { data: following } = await client.v2.followers(
				me.id,
				params
			);
			const { data: followers } = await client.v2.following(
				me.id,
				params
			);

			let isFollowing = false;
			let isFollower = false;

			for (let i = 0; i < following.length; i++) {
				const user = following[i];

				if (user.username === "nullluvsu") {
					isFollowing = true;
					break;
				}
			}

			for (let i = 0; i < followers.length; i++) {
				const user = followers[i];

				if (user.username === "nullluvsu") {
					isFollower = true;
					break;
				}
			}

			is_mutuals = isFollowing && isFollower;
		}

		req.session.account_info = {
			username: me.username,
			is_mutuals,
		};
	}

	res.redirect("/");
});

router.get("/login", (req, res) => {
	const codeChallenge = new CodeChallenge().generate();

	const params = {
		response_type: "code",
		client_id: process.env.TWITTER_CLIENT_ID || "",
		redirect_uri: getRedirectUri(),
		state: req.csrfToken(),
		scope: ["follows.read", "tweet.read", "users.read"].join(" "),
		code_challenge: codeChallenge.hash,
		code_challenge_method: "S256",
	};

	req.session.code_verifier = codeChallenge.verifier;

	const urlParams = new URLSearchParams(params).toString();
	res.redirect("https://twitter.com/i/oauth2/authorize?" + urlParams);
});

router.post("/logout", (req, res) => {
	if (req.session.logged_in !== true) {
		res.status(403).json({ error: "Unauthorized." });
		return;
	}
	req.session.destroy(() => 0);

	res.status(200).json({ message: "Successfully logged out." });
});

export default router;