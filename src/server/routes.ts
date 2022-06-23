import * as express from 'express';
import * as path from "path";
import * as session from "express-session";

import { SessionObject } from "./session.d";

// Middlewares
import login_twitter from './middleware/login_twitter';
import request_twitter from "./middleware/request_twitter";

const router = express.Router();

router.get("/api/auth/twitter/callback", (req, res, next) => {
    const session = req.session as session.Session & SessionObject;
    const code = req.query.code as string;

    if (code) {
        session.twitterCode = code;
        session.loggedIn = true;
        session.loginMethod = "twitter";
    }

}, request_twitter, (req, res) => {
    res.redirect("/");
});


router.post("/api/auth/twitter", login_twitter, (req, res, next) => {
    res.status(200);
});

// React router workaround
router.use((req, res) => {
    const session = req.session as session.Session & SessionObject;
    
    
    if (req.accepts("html")) {
        res.status(200).sendFile(path.resolve("public", "index.html"));
        return;
    }

    res.status(404);
    if (req.accepts("json")) {
        res.json({ error: "Not found"});
        return;
    }

    res.type("txt").send("Not found");
});

export default router;
