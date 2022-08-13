import jawsGetAuth from "../modules/jawsGetAuth";

export default function DBAuthFactory() {
	const { env } = process;
	if (env.NODE_ENV === "production") {
		const auth = jawsGetAuth();

		return {
			host: auth.hostname,
			port: +auth.port,
			user: auth.username,
			password: auth.password,
			database: auth.default_schema,
		};
	}

	if (!env.DATABASE_HOST || !env.DATABASE_USERNAME || !env.DATABASE_PASSWORD)
		throw "UNDEFINED / INCOMPLETE DATABASE AUTHORIZATION";

	return {
		host: env.DATABASE_HOST,
		user: env.DATABASE_USERNAME,
		password: env.DATABASE_PASSWORD,
	};
}
