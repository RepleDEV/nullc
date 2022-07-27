import * as express from "express";
import * as path from "path";

const router = express.Router();

import mail from "./routes/mail";
router.use(mail);

import login from "./routes/login";
router.use(login);

router.get("/account_info", (req, res) => {
	if (req.session.logged_in !== true)
		return res.status(403).json({ error: "Unauthorized" });

	const account_info: Record<string, unknown> = {
		username: req.session.account_info?.username,
		is_mutuals: req.session.account_info?.is_mutuals,
	};

	if (req.session.admin === true) account_info["admin"] = true;

	res.status(200).json(account_info);
});

// React router workaround
router.use((req, res) => {
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

export default router;
export { router };
export { mailDB } from "./routes/mail";
