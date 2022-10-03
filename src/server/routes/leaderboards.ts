import { RedisClientType } from "redis";
import * as dayjs from "dayjs";
import { Router } from "express";
import { TwitterApi } from "twitter-api-v2";

import "../../../.env.d";

type LeaderboardDataArray = {
    id: string;
    username: string;
}[];
interface LeaderboardData {
    data: LeaderboardDataArray;
    expires: number;
}

async function getLeaderboardData(): Promise<LeaderboardDataArray> {
    const { TWITTER_BEARER_TOKEN, TWITTER_ADMIN_ID } = process.env;
    if (!TWITTER_BEARER_TOKEN) 
        throw new Error("Bearer token not provided");
    

    // TODO: Make the api search up my ID number and use that as the username
    const { v2: client } = new TwitterApi(TWITTER_BEARER_TOKEN);

    const admin_username = TWITTER_ADMIN_ID ? (await client.user(TWITTER_ADMIN_ID)).data.username : "nullluvsu";

    // Query explanation: searches every tweet that mentions me.
    // in other words, replies, and tags directed towards me.
    // the -(from:nullluvsu) removes tweets from myself from the search results,
    // meaning, tweets of me replying to my own tweets (threads, essentially) is filtered out.
    const res = await client.search(`(to:${admin_username})`, {
        "user.fields": ["id", "username"],
        max_results: 50,
        expansions: ["author_id"],
    });

    if (res.errors.length)
        throw res.errors;

    let counted = 0;
    const users: Record<string, number> = {};
    while (counted < 100) {
        if (res.tweets.length === 0)
            break;

        for (const tweet of res.tweets) {
            if (tweet.author_id === TWITTER_ADMIN_ID)
                continue;

            const count = (users[tweet.author_id || ""] || 0) + 1

            users[tweet.author_id || ""] = count;
            counted++;
        }

        await res.fetchNext();
    }

    return Object.entries(users).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([author_id]) => {
        for (const { id, username } of res.includes.users) {
            if (id === author_id) {
                return { id, username };
            }
        }

        return { id: "undefined", username: "undefined" };
    });
}

export default function leaderboards(client: RedisClientType) {
    const router = Router();

    router.get("/leaderboard", async (req, res) => {
        const data = await client.get("leaderboard_data");
        let parsed_data = data && JSON.parse(data) as LeaderboardData;

        if (!parsed_data || !parsed_data.data.length || parsed_data.expires < Date.now()) {
            try {
                const leaderboard_arr = await getLeaderboardData();
                const leaderboard_data = {
                    data: leaderboard_arr,
                    expires: +dayjs().add(24, "hours"),
                };
                parsed_data = leaderboard_data;
                await client.set("leaderboard_data", JSON.stringify(parsed_data));
            } catch (err) {
                console.log(err);
                res.status(500).send(err.error);
                return;
            }
        }

        res.json(parsed_data.data);
    });

    return router;
}