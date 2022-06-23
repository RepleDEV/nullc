import * as express from 'express';
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import * as csrf from "csurf";
import * as dotenv from "dotenv";
dotenv.config();

import envTypes from '../../.env';

import router from './routes';
import apiRouter from "./api";

import { SessionObject } from './session';

const app = express();

app.use(session({
    // TODO: remove default value, add types to .env.d.ts for SESSION_SECRET
    secret: (process.env as NodeJS.ProcessEnv & envTypes).SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === "production",

    },
}));

app.use(express.json());
app.use(express.static('public'));

app.use("/api", apiRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
// TODO: Get types to WORK with express-session
app.use((req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    // res.locals.csrfToken = req.csrfToken();

    // Initialize session
    
    const sessionProperties = {
        "loggedIn": false,
        "loginMethod": null,
        "twitterCodeVerifier": null,
        "twitterCode": null,
        "twitterBearerToken": null,
        "twitterUserInfo": null,
    };
    
    for (const sessionKey in sessionProperties) {
        const defaultValue = sessionProperties[sessionKey];

        if (!req.session[sessionKey])
            req.session[sessionKey] = defaultValue;
    }

    next();
});
app.use((err, req, res, next) => {
    console.log(err);
    if (err.code !== "EBADCSRFTOKEN") return next(err);
    
    res.status(403);
    res.send("BAD CSRF TOKEN");
});
app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
