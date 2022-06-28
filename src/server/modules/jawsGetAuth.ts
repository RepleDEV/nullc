// I MAY BE GETTING THIS WRONG

export default function jawsGetAuth() {
    let JAWSDB_MARIA_URL = process.env.JAWSDB_MARIA_URL as string;

    JAWSDB_MARIA_URL = JAWSDB_MARIA_URL.substring("mysql://".length);
    JAWSDB_MARIA_URL.split("/");
    const default_schema = JAWSDB_MARIA_URL[1];
    const auth = JAWSDB_MARIA_URL[1].split("@");
    const [username, password] = auth[0].split(":");
    const [hostname, port] = auth[1].split(":");

    return { default_schema, username, password, hostname, port };
}