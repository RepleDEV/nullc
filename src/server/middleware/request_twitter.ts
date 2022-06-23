import { NextFunction, Request, Response } from "express";
import session from "express-session";
import { SessionObject, TwitterUserInfo } from "../session";
import axios from "axios";
import TwitterApi, {} from "twitter-api-v2";

import envTypes from "../../../.env.d";

function base64encode(str: string) {
    return Buffer.from(str).toString("base64");
}

interface BearerTokenObject {
    token_type: string;
    expires_in: number;
    access_token: string;
    scope: string;    
}

async function getToken(code: string, code_verifier: string): Promise<BearerTokenObject> {
    const { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } = process.env as NodeJS.ProcessEnv & envTypes;

    let basicAuthStr = TWITTER_CLIENT_ID + ":" + TWITTER_CLIENT_SECRET;
    basicAuthStr = base64encode(basicAuthStr);
    
    const res = await axios({
        url: "https://api.twitter.com/2/oauth2/token",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuthStr}`,
        },
        params: {
            code,
            redirect_uri: "http://localhost:3000/api/auth/twitter/callback",
            code_verifier,
            grant_type: "authorization_code",
        }
    });

    return res.data;
}

async function getUserInfo(access_token: string): Promise<void> {
    const client = new TwitterApi(access_token).readOnly.v2;

    const user = await client.me({
        "user.fields": [
            "public_metrics",
            "created_at",
        ],
    });

    if (user.errors)
        throw { message: user.errors };
    
    const { data } = user;

}

async function request_twitter(req: Request, res: Response, next: NextFunction) {
    const session = req.session as session.Session & SessionObject;
    
    const { twitterCode, twitterCodeVerifier } = session;
    if (twitterCode) {
        const token = await getToken(twitterCode, twitterCodeVerifier).catch((err) => {
            console.log("Error lol");
            console.log(err);
        });

        if (token) {
            session.twitterBearerToken = token.access_token;

        }
    }

    next();
}

export default request_twitter;
