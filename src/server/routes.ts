import * as express from "express";

const router = express.Router();

import mail from "./routes/mail";
router.use(mail);

import login from "./routes/login";
router.use(login);

import leaderboards from "./routes/leaderboards";

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

export default (redisClient: any) => {
	router.use(leaderboards(redisClient));

	return router;
};
export { mailDB } from "./routes/mail";
