import { Router } from "express";
import MailDB from "../modules/mailDB";

import "../../../.env.d";

const router = Router();

import DBAuthFactory from "../modules/DBAuthFactory";
const mailDB = new MailDB("nullluvsu", DBAuthFactory());

router.get("/mail_data", (req, res) => {
	if (req.session.admin !== true) return res.status(403).json({ error: "UNAUTHORIZED." });
	mailDB.getMail().then((mailContents) => {
		res.status(200).json(mailContents);
	}).catch((err) => {
		res.status(500).json({ error: "INTERNAL SERVER ERROR." });
		console.error(err);
	});
});

router.post("/mail", (req, res) => {
	// Do shit
	const { name, message } = req.body;
	if (!name || !message)
		return res.status(400).json({ error: "BAD FORM DATA" });

	mailDB
		.addMail(name, message)
		.then(() => {
			res.status(200).json({ message: "SUCCESS" });
		})
		.catch((err) => {
			res.status(500).json({ error: "INTERNAL SERVER ERROR" });
			console.error("AN ERROR HAS OCCURRED WHEN TRYING TO INSERT MAIL DATA.");
			console.error(err);
		});
});

export default router;
export { mailDB };