import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as redisConnect from "connect-redis";
const RedisClient = redisConnect(session);
import * as csrf from "csurf";
import * as dotenv from "dotenv";
dotenv.config();
import envTypes from "../../.env";
import router from "./routes";
import { refreshMootsList } from "./scripts/moots";

import { createClient } from "redis";
let redisClient = createClient({ 
	url: process.env.REDISCLOUD_URL || "",
});

declare module "express-session" {
	export interface SessionData {
		code_verifier?: string;
		access_token?: string;
		logged_in?: boolean;
		account_info?: {
			username: string;
			is_mutuals: boolean;
		};
		admin?: boolean;
	}
}

const app = express();

// SERVE STATIC FILES
app.use(express.static("public"));

// SETUP PARSERS
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// CSRF SETUP
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection, (req, res, next) => {
	res.cookie("XSRF-TOKEN", req.csrfToken());
	next();
});

// SETUP SESSION
let session_secret = (process.env as NodeJS.ProcessEnv & envTypes)
	.SESSION_SECRET;
if (!session_secret)
	if (process.env.NODE_ENV === "production")
		// Prevent server from starting if there is no session secret
		throw "NO SESSION SECRET. STOPPED SERVER.";
	// Only set to keyboard cat (for whatever reason) only when not in production
	else session_secret = "keyboard_cat";
app.use(
	session({
		store: new RedisClient({ client: redisClient }),
		secret: session_secret,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60 * 6, // 6 hrs
		},
	})
);

// HANDLE BAD CSRF TOKEN
app.use(
	(
		err: Record<string, unknown>,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (err.code !== "EBADCSRFTOKEN") return next(err);

		res.status(403);
		res.json({ error: "BAD CSRF TOKEN" });
	}
);
app.use(router);

const port = process.env.PORT || 3000;

(async () => {
	if (process.env.NODE_ENV === "production") await refreshMootsList();
	await redisClient.connect();

	app.listen(port, () => console.log(`Server listening on port: ${port}`));
})();
