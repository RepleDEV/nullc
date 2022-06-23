import React, { Component } from "react";
import { Navigate } from "react-router-dom";

import axios from "axios";

import "../scss/pages/Login.scss";

interface LoginProps {
    loginSuccess: () => void;
}
interface LoginStates {
    twitter_redirect_url: string;
}
class Login extends Component<LoginProps, LoginStates> {
    constructor(props: LoginProps) {
        super(props);

        this.state = {
            twitter_redirect_url: ""
        }

        this._twitterLoginHandler = this._twitterLoginHandler.bind(this);
    }
    async componentDidMount(): Promise<void> {
        // const res = await axios({
        //     method: "GET",
        //     url: "/login",
        //     responseType: "json",
        //     headers: {
        //         "Accept": "application/json"
        //     },
        // });

        // console.log(res.data);
    }
    _twitterLoginHandler() {
        window.open("api/auth/twitter", "_blank", "width=800,height=600");
        return;
        axios({
            method: "POST",
            url: "/api/auth/twitter",
            responseType: "json"
        }).then((res) => {
            const twitter_redirect_url = res.data as string;
            console.log(twitter_redirect_url);

            window.open(twitter_redirect_url, "_blank", "width=800,height=600,titlebar=no");
        });
    }
    render(): React.ReactNode {
        const { twitter_redirect_url } = this.state;

        if (twitter_redirect_url.length)
            window.location.replace(twitter_redirect_url);

        return (
            <div className="page Login">
                <div className="placeholder-login">
                    <button type="submit" className="login-twitter-submit" onClick={this._twitterLoginHandler}>
                        login
                    </button>
                </div>
            </div>
        );
    }
}

export default Login;
export { LoginProps, LoginStates };
