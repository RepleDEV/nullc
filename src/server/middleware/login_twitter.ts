import { Request, Response, NextFunction } from "express";
import session from "express-session";
import envTypes from "../../../.env.d";

import { SessionObject } from "../session.d";

import CodeChallenge from "../modules/codeChallenge";

/**
 * OAuth2.0 Scopes
 * @see https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code
 */
type AuthURLScopes =
	/**
	 * All the Tweets you can view, including Tweets from protected accounts.
	 */
	| "tweet.read"
	/**
	 * Tweet and Retweet for you.
	 */
	| "tweet.write"
	/**
	 * Hide and unhide replies to your Tweets.
	 */
	| "tweet.moderate.write"
	/**
	 * Any account you can view, including protected accounts.
	 */
	| "users.read"
	/**
	 * People who follow you and people who you follow.
	 */
	| "follows.read"
	/**
	 * Follow and unfollow people for you.
	 */
	| "follows.write"
	/**
	 * Stay connected to your account until you revoke access.
	 */
	| "offline.access";
interface AuthURLOptions {
	redirect_uri: string;
	scope: AuthURLScopes[];
	state: string;
}
class AuthURL {
	clientId: string;
	constructor(clientId: string) {
		this.clientId = clientId;
	}
	generate(options: AuthURLOptions): { url: string; verifier: string } {
		let url = "https://twitter.com/i/oauth2/authorize?";
		url += "response_type=code&";
		url += `client_id=${this.clientId}&`;
		url += `redirect_uri=${options.redirect_uri}&`;
		url += `scope=${options.scope.join(" ")}&`;
		url += `state=${options.state}&`;
		const codeChallenge = new CodeChallenge(56, true);
		codeChallenge.generate();
		url += `code_challenge=${codeChallenge.hash}&`;
		url += "code_challenge_method=S256";

		url = encodeURI(url);

		return { url, verifier: codeChallenge.verifier };
	}
}

function login_twitter(req: Request, res: Response, next: NextFunction) {
	const csrf_token = req.headers["x-xsrf-token"] as string;

	const { TWITTER_CLIENT_ID: client_id } = process.env as NodeJS.ProcessEnv &
		envTypes;

	const authUrl = new AuthURL(client_id);

	const twitterAuthUrl = authUrl.generate({
		redirect_uri: "http://localhost:3000/api/auth/twitter/callback",
		state: csrf_token,
		scope: ["follows.read", "users.read", "tweet.read"],
	});

	const session = req.session as session.Session & SessionObject;
	session.twitterCodeVerifier = twitterAuthUrl.verifier;

	res.redirect(twitterAuthUrl.url);

	next();
}

export default login_twitter;
