import React, { Component } from "react";

import PageReturn from "../components/PageReturn";

import "../scss/pages/Self.scss";

interface BulletRowContainerProps {
    
}
interface BulletRowContainerStates {

}
class BulletRowContainer extends Component<BulletRowContainerProps, BulletRowContainerStates> {
    render(): React.ReactNode {
        return (
            <div className="bullet-row-container">
                <div className="line-container" />
                { this.props.children }
            </div>
        );
    }
}

interface SelfProps {

}
interface SelfStates {

}
class Self extends Component<SelfProps, SelfStates> {
    render(): React.ReactNode {
        return (
            <div className="page Self">
                <PageReturn />
                <div className="row-container main-info">
                    <div className="left">
                        <h1 className="name"><span className="inner-container">####</span></h1>
                        <BulletRowContainer>
                            <span className="text-container">
                                he/him
                            </span>
                        </BulletRowContainer>
                        <BulletRowContainer>
                            <span className="text-container">
                                <span className="medium">eng</span>/id
                            </span>
                        </BulletRowContainer>
                        <BulletRowContainer>
                            <span className="text-container">
                                <span className="medium">AR 56</span> / <span className="light">asia server</span>
                            </span>
                        </BulletRowContainer>
                    </div>
                    <div className="right">
                        <span className="text-container">
                            Kay
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Self;
export { SelfProps, SelfStates };