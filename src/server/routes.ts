import * as express from "express";
import * as path from "path";
import envTypes from "../../.env";
import jawsGetAuth from "./modules/jawsGetAuth";
import MailDB from "./modules/mailDB";

const router = express.Router();

const env = process.env as (NodeJS.ProcessEnv & envTypes);

// TODO: Make this easier to READ NOT FIX U MORON
const mailDB = new MailDB("nullluvsu", process.env.NODE_ENV === "production" ? (() => {
	const auth = jawsGetAuth();

	return {
		host: auth.hostname,
		port: +auth.port,
		user: auth.username,
		password: auth.username,
	};
})() : (() => { 
	if (!env.DATABASE_HOST || !env.DATABASE_USERNAME || !env.DATABASE_PASSWORD)
		throw "UNDEFINED / INCOMPLETE DATABASE AUTHORIZATION";

	return {
		host: env.DATABASE_HOST,
		user: env.DATABASE_USERNAME,
		password: env.DATABASE_PASSWORD,
	};
})());

(async () => {
	await mailDB.setup();
})();

router.post("/mail", (req, res) => {
	// Do shit
	const { name, message } = req.body;
	if (!name || !message)
		return res.status(400).json({ error: "BAD FORM DATA" });
	
	mailDB.addMail(name, message).then(() => {
		res.status(200).json({ message: "SUCCESS" });
	}).catch(() => {
		res.status(500).json({ error: "INTERNAL SERVER ERROR"});
	});

});

// React router workaround
router.use((req, res) => {
	if (req.accepts("html")) {
		res.status(200).sendFile(path.resolve("public", "index.html"));
		return;
	}

	res.status(404);
	if (req.accepts("json")) {
		res.json({ error: "Not found" });
		return;
	}

	res.type("txt").send("Not found");
});

export default router;
