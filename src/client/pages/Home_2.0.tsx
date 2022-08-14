import React, { Component } from "react";

import "../scss/pages/Home";

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
                    </div>
                    <div className="column right">

                    </div>
                </div>
            </div>
        );
    }
}

export default Home;