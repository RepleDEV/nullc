import TwitterApi, { ProfileBannerSizeV1, UserV2 } from "twitter-api-v2";
import "../../../.env.d";

import MootsList from "../../../public/moots_list.d";

import { promises as fs } from "fs";
import * as path from "path";
import axios from "axios";

const env = process.env;
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

async function check404(url: string): Promise<boolean> {
	return new Promise((res) => {
		axios(url)
			.then(() => {
				res(false);
			})
			.catch(() => {
				res(true);
			});
	});
}

interface RefreshMootsListConfig {
	refresh?: boolean;
	// Maybe select PFP size
}
// eslint-disable-next-line
export async function refreshMootsList(config?: RefreshMootsListConfig) {
	console.log("Refreshing Mutual List.");

	const filePath = path.resolve("./public/moots_list.json");
	const file = await fs.readFile(filePath, { encoding: "utf-8" });
	const moots_list = JSON.parse(file) as MootsList;

	for (let i = 0; i < moots_list.length; i++) {
		const moot = moots_list[i];

		if (config && !config.refresh) continue;

		let check = false;

		if (moot.id === "-1") {
			check = true;
		} else {
			const changedProfilePicture = await check404(moot.icon);
			const changedHeader =
				moot.header.length && (await check404(moot.header));

			check = changedProfilePicture || !!changedHeader;
		}

		if (check) {
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
