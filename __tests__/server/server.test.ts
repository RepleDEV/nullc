import { URL, URLSearchParams } from "url";
import Session from "../modules/sessions";
import app, { redisClient, mailDB } from "../../src/server/server";

import "html-validate/jest";

import * as dotenv from "dotenv";
dotenv.config();

describe("Server test", () => {
    let request: Session;

    beforeEach(() => {
        request = new Session(app, {
            before: (req) => {
                // TODO: This doesn't work (unsurprisingly)
                // TODO: fix 
                const xsrf = request.cookies.find((cookie) => cookie.name === "XSRF-TOKEN");

                if (xsrf) {
                    req.set("x-xsrf-token", xsrf.value);
                }

                return req;
            },
        });
    });

    afterEach(() => {
        request.destroy();
        request.server.close();
    });

    // Connect session store hehehehehe
    beforeAll(async () => {
        await redisClient.connect();
        await mailDB.connect();
        await mailDB.setup();
    });

    afterAll(async () => {
        await redisClient.disconnect();
        await new Promise<void>((resolve, reject) => {
            mailDB.connection.end((err) => {
                if (err)return reject(err);
                resolve();
            });
        });
    });

    describe("Endpoint responses", () => {
        test("root path should respond correctly", async () => {
            const res = await request.get("/");

            expect(res.statusCode).toEqual(200);
        });

        test("404 responses", async () => {
            const res_json = await request.get("/theresnowaythisisavalidpath")
                .set({ "Accept": "application/json" });

            expect(res_json.statusCode).toBe(404);
            expect(res_json.body).toEqual({ error: "Not found" });

            const res_plain = await request.get("/theresnowaythisisavalidpath")
                .set({ "Accept": "text/plain" });
            expect(res_plain.statusCode).toBe(404);
            expect(res_plain.text).toBe("Not found");

            const res_html = await request.get("/theresnowaythisisavalidpath");
            expect(res_html.statusCode).toBe(404);
            expect(res_html.text).toHTMLValidate();
        });
    });
    describe("Login implementation", () => {
        test("login redirect should be correct", async () => {
            const res = await request.get("/login");
            const location = new URL(res.headers.location as string);

            expect(location.hostname).toBe("twitter.com");
            expect(location.protocol).toBe("https:");
            expect(location.pathname).toBe("/i/oauth2/authorize");
            expect(location.searchParams.get("response_type")).toBe("code");
            expect(location.searchParams.get("client_id")).toBe(process.env.TWITTER_CLIENT_ID);
            expect((new URL(location.searchParams.get("redirect_uri") || "")).pathname).toBe("/callback");
            expect(location.searchParams.get("code_challenge_method")).toBe("S256");

            expect(res.statusCode).toBe(302);
        });

        it("should login and logout smoothly", async () => {
            process.env.NODE_ENV = "test";

            const params = {
                test: "true",
                is_mutuals: "true",
                username: "somerandouser",
            }

            const res_login = await request.get("/login").query(params);
            expect(res_login.statusCode).toBe(302);

            const _csrf = request.cookies.find((cookie) => cookie.name === "_csrf");
            const xsrf = request.cookies.find((cookie) => cookie.name === "XSRF-TOKEN");

            // Also check for csrf tokens
            expect(_csrf).toBeDefined();
            expect(xsrf).toBeDefined();

            if (!_csrf)return;
            if (!xsrf)return;

            const res_logout = await request.post("/logout")
            expect(res_logout.statusCode).toBe(200);
        });
    });
});