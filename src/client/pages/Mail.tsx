import React, { Component } from "react";
import PageReturn from "../components/PageReturn";

import "../scss/pages/Mail.scss";

class Mail extends Component {
    render(): React.ReactNode {
        return (
            <div className="page Mail">
                <PageReturn />
            </div>
        );
    }
}

export default Mail;