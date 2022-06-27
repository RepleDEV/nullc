import * as express from "express";
import * as path from "path";

const router = express.Router();

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
