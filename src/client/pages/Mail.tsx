import React, { Component } from "react";
import PageReturn from "../components/PageReturn";
import Form, { FormInput } from "../components/Form";

import "../scss/pages/Mail.scss";

class Mail extends Component {
    render(): React.ReactNode {
        return (
            <div className="page Mail">
                <PageReturn />
                <Form to="/">
                    <FormInput type="text" inputProps={
                        {
                            placeholder: "Anon",
                            name: "name",
                        }
                    }>Name</FormInput>
                    <FormInput type="textarea" required textareaProps={
                        {
                            placeholder: "What's on your mind?",
                            name: "message",
                        }
                    }>Message</FormInput>
                    <FormInput type="submit" inputProps={
                        {
                            value: "Submit",
                            name: "submit",
                        }
                    }></FormInput>
                </Form>
            </div>
        );
    }
}

export default Mail;