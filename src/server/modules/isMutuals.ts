import { TwitterApi } from "twitter-api-v2";

export default async function isMutuals(
	client: TwitterApi,
	id: string,
	max_results: number
) {
	// TODO: This shit O(n) pls fix
	// TODO: Along with 2 async requests huh
	const params = {
		max_results,
	};

	const { data: following } = await client.v2.followers(id, params);
	const { data: followers } = await client.v2.following(id, params);

	let isFollowing = false;
	let isFollower = false;

	for (let i = 0; i < following.length; i++) {
		const user = following[i];

		if (user.username === "nullluvsu") {
			isFollowing = true;
			break;
		}
	}

	for (let i = 0; i < followers.length; i++) {
		const user = followers[i];

		if (user.username === "nullluvsu") {
			isFollower = true;
			break;
		}
	}

	return isFollowing && isFollower;
}
