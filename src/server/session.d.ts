interface TwitterUserInfo {
    displayName: string;
    username: string;
    isMutuals: boolean;
    interactionCount: number;
    created_at: string;
}

interface SessionObject {
    loggedIn: boolean;
    loginMethod: "user" | "twitter" | null;
    twitterCodeVerifier: string | null;
    twitterCode: string | null;
    twitterBearerToken: string | null;
    twitterUserInfo: TwitterUserInfo | null;
}

export { SessionObject, TwitterUserInfo };
