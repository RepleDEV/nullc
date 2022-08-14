import React, { Component } from "react";

import Github from "../components/svg/GithubMark";

import "../scss/pages/Home";

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

class Home extends Component {
    render(): React.ReactNode {
        return (
            <div className="page Home">
                <div className="twin-columns">
                    <div className="column left">
                        <div className="name-card">
                            <div className="profile-picture-container">
                                <img
                                    src="https://cdn.discordapp.com/avatars/246789625715228672/8441bcb570405a341717dead19458801.png?size=4096"
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
                        <div className="corner-links">
                            <a href="https://github.com/repledev/" target="_blank"><Github /></a>
                        </div>
                    </div>
                    <div className="column right">

                    </div>
                </div>
            </div>
        );
    }
}

export default Home;