import { URL } from "url";
import { validate, version } from "uuid";
import Session from "../modules/sessions";
import app, { redisClient, mailDB } from "../../src/server/server";

import "html-validate/jest";

import * as dotenv from "dotenv";
import { mailDB as MailDB } from "../../src/server/types/modules";
dotenv.config();

describe("Server test", () => {
	let request: Session;

	beforeEach(() => {
		request = new Session(app, {
			before: (req) => {
				// TODO: This doesn't work (unsurprisingly)
				// TODO: fix
				const xsrf = request.cookies.find(
					(cookie) => cookie.name === "XSRF-TOKEN"
				);

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
				if (err) return reject(err);
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
			const res_json = await request
				.get("/theresnowaythisisavalidpath")
				.set({ Accept: "application/json" });

			expect(res_json.statusCode).toBe(404);
			expect(res_json.body).toEqual({ error: "Not found" });

			const res_plain = await request
				.get("/theresnowaythisisavalidpath")
				.set({ Accept: "text/plain" });
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
			expect(location.searchParams.get("client_id")).toBe(
				process.env.TWITTER_CLIENT_ID
			);
			expect(
				new URL(location.searchParams.get("redirect_uri") || "")
					.pathname
			).toBe("/callback");
			expect(location.searchParams.get("code_challenge_method")).toBe(
				"S256"
			);

			expect(res.statusCode).toBe(302);
		});

		it("should login and logout smoothly", async () => {
			process.env.NODE_ENV = "test";

			const params = {
				test: "true",
				is_mutuals: "true",
				username: "somerandouser",
			};

			const res_login = await request.get("/login").query(params);
			expect(res_login.statusCode).toBe(302);

			const _csrf = request.cookies.find(
				(cookie) => cookie.name === "_csrf"
			);
			const xsrf = request.cookies.find(
				(cookie) => cookie.name === "XSRF-TOKEN"
			);

			// Also check for csrf tokens
			expect(_csrf).toBeDefined();
			expect(xsrf).toBeDefined();

			if (!xsrf) return;

			const res_logout = await request.post("/logout");
			expect(res_logout.statusCode).toBe(200);
		});
	});

	describe("mail tests", () => {
		beforeEach(async () => {
			await request.get("/");
		});
		test("bad form data", async () => {
			const res = await request.post("/mail");
			expect(res.statusCode).toBe(400);
			expect(res.body).toEqual({ error: "BAD FORM DATA" });

			const res_name_only = await request.post("/mail").send({
				name: "foo",
			});
			expect(res_name_only.statusCode).toBe(400);
			expect(res_name_only.body).toEqual({ error: "BAD FORM DATA" });

			const res_message_only = await request.post("/mail").send({
				message: "bar",
			});
			expect(res_message_only.statusCode).toBe(400);
			expect(res_message_only.body).toEqual({ error: "BAD FORM DATA" });
		});
		test("sending and receiving mail", async () => {
			const messageBody = {
				name: "Walter Hartwell White",
				message: `My name is Walter Hartwell White.
                    I live at 308 Negra Arroyo Lane, Albuquerque, New Mexico, 87104.
                    To all law enforcement entities, this is not an admission of guilt.
                    I am speaking to my family now. Skyler, you are the love of my life. I hope you know that.
                    Walter Jr., you're my big man.
                    There are going to be some things that you'll come to learn
                    about me in the next few years.
                    But just know that no matter how it may look, I only had you in my heart.
                    Goodbye.`,
			};

			const res = await request.post("/mail").send(messageBody);
			expect(res.statusCode).toBe(200);
			expect(res.body).toEqual({ message: "SUCCESS" });

			// Admin login
			await request.get("/login").query({ test: true, admin: "true" });

			const res_mail = await request.get("/mail_data");
			expect(res_mail.statusCode).toBe(200);
			const mail_data = res_mail.body as MailDB.MailObjectArray;
			expect(mail_data.length >= 1).toBeTruthy();
			const mail = mail_data[mail_data.length - 1];
			expect(mail.author).toEqual(messageBody.name);
			expect(mail.message).toEqual(messageBody.message);
			expect(mail.uuid).toBeDefined();
			expect(mail.uuid.length).toBe(36);
			expect(validate(mail.uuid)).toBeTruthy();
			expect(version(mail.uuid)).toBe(4);
			// TODO Maybe check the timestamp as well

			// Clean up
			await mailDB.query(
				`DELETE FROM ${mailDB.tableName} WHERE uuid='${mail.uuid}';`
			);
		});
	});

	test("bad csrf error", async () => {
		const res = await request.post("/mail");
		expect(res.statusCode).toBe(403);
		expect(res.body).toEqual({ error: "BAD CSRF TOKEN" });
	});
});
