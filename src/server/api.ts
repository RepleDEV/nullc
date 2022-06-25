import * as express from "express";

const router = express.Router();

router.get("/forms", (req, res, next) => {
	res.status(200).json({ foo: "bar" });
});

export default router;
