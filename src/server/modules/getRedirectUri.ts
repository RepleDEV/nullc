import "../../../.env.d";

export default () =>
	`http${
		process.env.NODE_ENV === "production"
			? "s://nullluvsu.herokuapp.com"
			: `://localhost:3000`
	}/callback`;
