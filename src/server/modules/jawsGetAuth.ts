// I MAY BE GETTING THIS WRONG

export default function jawsGetAuth() {
	// Schema: mysql://username:password@hostname:port/default_schema
	const JAWSDB_MARIA_URL = process.env.JAWSDB_MARIA_URL as string;
	if (!JAWSDB_MARIA_URL)
		throw "UNDEFINED / INCOMPLETE DATABASE AUTHORIZATION";

	const split_url = JAWSDB_MARIA_URL.substring("mysql://".length).split("/");
	const default_schema = split_url[1];
	const auth = split_url[0].split("@");
	const [username, password] = auth[0].split(":");
	const [hostname, port] = auth[1].split(":");

	return { default_schema, username, password, hostname, port };
}
