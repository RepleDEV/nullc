declare namespace NodeJS {
	export interface ProcessEnv {
		TWITTER_CLIENT_ID?: string;
		TWITTER_CLIENT_SECRET?: string;

		TWITTER_BEARER_TOKEN?: string;

		SESSION_SECRET?: string;

		DATABASE_HOST?: string;
		DATABASE_USERNAME?: string;
		DATABASE_PASSWORD?: string;

		NODE_ENV: "production" | "development" | "test" | "";
	}
}
