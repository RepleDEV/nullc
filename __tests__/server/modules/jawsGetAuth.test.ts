import jawsGetAuth from "../../../src/server/modules/jawsGetAuth";
import randomStringGenerator from "../../modules/randomStringGenerator";

describe("Jaws get auth", () => {
	describe("Simple auth", () => {
		const username = randomStringGenerator(8);
		const password = randomStringGenerator(16);
		const host = "www." + randomStringGenerator(8) + ".com";
		const port = Math.floor(Math.random() * 5000) + 3000;
		const database = randomStringGenerator(8);

		const url = `mysql://${username}:${password}@${host}:${port}/${database}`;
		process.env.JAWSDB_MARIA_URL = url;

		const auth = jawsGetAuth();

		test("username parsing", () => {
			expect(auth.username).toBe(username);
		});
		test("password parsing", () => {
			expect(auth.password).toBe(password);
		});
		test("host parsing", () => {
			expect(auth.hostname).toBe(host);
		});
		test("port parsing", () => {
			expect(auth.port).toBe(port.toString());
		});
		test("database/default_schema parsing", () => {
			expect(auth.default_schema).toBe(database);
		});

		test("error throw when url is undefined", () => {
			process.env.JAWSDB_MARIA_URL = "";
			expect(() => jawsGetAuth()).toThrow();
		});
	});
});
