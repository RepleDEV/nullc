import TwitterApi, { ProfileBannerSizeV1, UserV2 } from "twitter-api-v2";
import envTypes from "../../../.env";

import MootsList from "../../../public/moots_list.d";

import { promises as fs } from "fs";
import * as path from "path";

const env = process.env as NodeJS.ProcessEnv & envTypes;
const bearer_token = env.TWITTER_BEARER_TOKEN;

export async function refreshMutual(username: string): Promise<UserV2 | void>;
export async function refreshMutual(
	username: string,
	getHeader?: boolean
): Promise<(UserV2 & { header: ProfileBannerSizeV1 }) | void>;
export async function refreshMutual(username: string): Promise<unknown> {
	if (!bearer_token) {
		return console.warn(
			"No bearer token provided. refreshMutual() returned."
		);
	}

	const client = new TwitterApi(bearer_token).readOnly;
	const usernameLookup = await client.v2.userByUsername(username, {
		"user.fields": ["profile_image_url"],
	});

	if (usernameLookup.errors?.length) return;

	// TODO: DO THIS AFTER ELEVATED ACCESS
	// const headerLookup = await client.v1.userProfileBannerSizes({
	//     user_id: usernameLookup.data.id
	// });

	// return { ...usernameLookup.data, header: headerLookup } ;

	return usernameLookup.data;
}

interface RefreshMootsListConfig {
	refresh: ("all" | "header")[];
	// Maybe select PFP size
}
export async function refreshMootsList(config?: RefreshMootsListConfig) {
	console.log("Refreshing Mutual List.");

	const filePath = path.resolve("./public/moots_list.json");
	const file = await fs.readFile(filePath, { encoding: "utf-8" });
	const moots_list = JSON.parse(file) as MootsList;

	for (let i = 0; i < moots_list.length; i++) {
		const moot = moots_list[i];

		// New moot
		if (moot.id == "-1") {
			const refreshedData = await refreshMutual(moot.username);

			if (refreshedData) {
				const { id, username, profile_image_url } = refreshedData;

				moots_list[i] = {
					id,
					username,
					header: "",
					icon: profile_image_url
						? profile_image_url.replace("normal", "bigger")
						: "",
				};
			}
		}
	}

	console.log("Done.");

	await fs.writeFile(filePath, JSON.stringify(moots_list, null, 4), {
		encoding: "utf-8",
	});
	return;
}
