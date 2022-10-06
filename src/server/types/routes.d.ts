export namespace leaderboards {
    export type LeaderboardDataArray = {
        id: string;
        username: string;
    }[];
    export interface LeaderboardData {
        data: LeaderboardDataArray;
        expires: number;
    }
}