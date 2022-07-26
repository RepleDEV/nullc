import { refreshMootsList } from "./scripts/moots";
import app, { redisClient, mailDB } from "./server";

const port = process.env.PORT || 3000;

(async () => {
	await mailDB.setup(process.env.NODE_ENV === "production");

	if (process.env.NODE_ENV === "production") await refreshMootsList();
	await redisClient.connect();

	app.listen(port, () => console.log(`Server listening on port: ${port}`));
})();