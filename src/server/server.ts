import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as csrf from "csurf";
import * as dotenv from "dotenv";
dotenv.config();
import envTypes from "../../.env";
import router from "./routes";
import { refreshMootsList } from "./scripts/moots";

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
	res.cookie('XSRF-TOKEN', req.csrfToken());
	next();
});

// SETUP SESSION
app.use(
	session({
		// TODO: remove default value, add types to .env.d.ts for SESSION_SECRET
		secret:
			(process.env as NodeJS.ProcessEnv & envTypes).SESSION_SECRET ||
			"keyboard cat",
		resave: false,
		saveUninitialized: true,
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
		console.log(req.body, req.csrfToken());

		res.status(403);
		res.json({ error: "BAD CSRF TOKEN" });
	}
);
app.use(router);

const port = process.env.PORT || 3000;

(async () => {
	// await refreshMootsList();

	app.listen(port, () => console.log(`Server listening on port: ${port}`));
})();
