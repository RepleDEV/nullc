import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as redisConnect from "connect-redis";
const RedisClient = redisConnect(session);
import * as csrf from "csurf";
import * as dotenv from "dotenv";
dotenv.config();
import router from "./routes";
import * as path from "path";

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
		csrfSecret?: string;
	}
}

const app = express();

// SETUP PARSERS
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// SETUP SESSION
let session_secret = process.env.SESSION_SECRET;
if (!session_secret)
	if (process.env.NODE_ENV === "production")
		// Prevent server from starting if there is no session secret
		throw "NO SESSION SECRET. STOPPED SERVER.";
	// Only set to keyboard cat (for whatever reason) only when not in production
	else session_secret = "keyboard_cat";
app.set("trust proxy", 1);
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

// CSRF SETUP
const csrfProtection = csrf({
	cookie: {
		secure: process.env.NODE_ENV === "production",
	},
});
app.use(csrfProtection);
app.all("*", (req, res, next) => {
	res.cookie("XSRF-TOKEN", req.csrfToken());
	next();
});

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

// SERVE STATIC FILES
app.use(express.static("public"));
app.use(router(redisClient));

// React router workaround
app.use((req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.resolve("public", "index.html"));
		return;
	}

	if (req.accepts("json")) {
		res.json({ error: "Not found" });
		return;
	}

	res.type("txt").send("Not found");
});

export default app;
export { app, redisClient };
export { mailDB } from "./routes";
