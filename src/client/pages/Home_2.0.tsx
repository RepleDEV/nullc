import React, { Component } from "react";
import { BasicComponentProps } from "../types/Component";

import Github from "../components/svg/GithubMark";

import "../scss/pages/Home";

class LeaderboardEntry extends Component<{
    number: number | string;
} & BasicComponentProps> {
    render(): React.ReactNode {
        return (
            <div className="entry">
                <span className="number-container">{this.props.number}</span>
                <div className="dot-container"></div>
                <span className="name">{this.props.children}</span>
            </div>
        );
    }
}

class Leaderboards extends Component<BasicComponentProps, {
    users: string[];
}> {
    constructor(props: BasicComponentProps) {
        super(props);

        this.state = {
            users: [...Array(10).fill("")],
        };

        this.usersMapFunction = this.usersMapFunction.bind(this);
    }
    usersMapFunction(user: string, i: number) {
        return (
            <LeaderboardEntry number={i + 1} key={`${user}-${i}`}>{user}</LeaderboardEntry>   
        );
    }
    async componentDidMount() {
        const leaderboard_data = await (await fetch("/leaderboard")).json() as any[];
        const data = leaderboard_data.map((v) => v.username);
        if (data.length)
            this.setState({ users: data });
    }
    render(): React.ReactNode {
        const { users } = this.state;

        const entries = users.map(this.usersMapFunction);

        const halfIndex = users.length < 5 ? users.length : 5;
        return (
            <>
                <div className="column left">
                    {
                        entries.slice(0, halfIndex)
                    }
                </div>
                <div className="column right">
                    {
                        entries.slice(halfIndex)
                    }
                </div>
            </>
        );
    }
}

class BulletPoint extends Component {
    render(): React.ReactNode {
        return (
            <div className="bullet-point">
                <div className="line-container">

                </div>
                <span className="text">
                    {this.props.children}
                </span>
            </div>
        );
    }
}

class CornerLinks extends Component {
    render(): React.ReactNode {
        return (
            <div className="corner-links">
                <a href="https://github.com/repledev/" target="_blank"><Github /></a>
            </div>
        );
    }
}

class Home extends Component {
    render(): React.ReactNode {
        return (
            <div className="page Home">
                <div className="twin-columns">
                    <div className="column left">
                        <div className="name-card">
                            <div className="profile-picture-container">
                                <img
                                    src="/profile_image.jpg"
                                    alt="Profile Image" 
                                />
                            </div>
                            <span className="name">
                                null
                            </span>
                        </div>
                        <div className="bullet-points">
                            <BulletPoint>he/him</BulletPoint>
                            <BulletPoint>eng/id</BulletPoint>
                            <BulletPoint>'07 liner</BulletPoint>
                        </div>
                        <CornerLinks/>
                    </div>
                    <div className="column right">
                        <div className="interests">
                            <span className="top-text">interests</span>
                            <div className="line-container"></div>
                            <div className="content twin-columns">
                                <div className="column left">
                                    <span>genshin</span>
                                    <span>guitar</span>
                                    <span>coffee</span>
                                </div>
                                <div className="column right">
                                    <span>radiohead</span>
                                    <span>programming</span>
                                </div>
                            </div>
                        </div>
                        <div className="leaderboards">
                            <div className="top-text">top interactive users</div>
                            <div className="line-container"></div>
                            <div className="content twin-columns">
                                <Leaderboards />
                            </div>
                        </div>
                        <CornerLinks/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;