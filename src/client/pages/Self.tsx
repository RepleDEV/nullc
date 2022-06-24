import React, { Component } from "react";

import PageReturn from "../components/PageReturn";
import Footer from "../components/Footer";

import "../scss/pages/Self.scss";

interface BulletRowProps {
    bulletStyle?: "line" | "dot";
}
class BulletRow extends Component<BulletRowProps, {}> {
    render(): React.ReactNode {
        const bulletStyle = this.props.bulletStyle || "line";

        return (
            <div className="bullet-row-container">
                {
                    bulletStyle === "line" ? 
                    <div className="line-container" /> :
                    <div className="dot-container"></div>
                }
                <span className="text-container">{ this.props.children }</span>
            </div>
        );
    }
}

interface SelfProps { }
interface SelfStates { }
class Self extends Component<SelfProps, SelfStates> {
    render(): React.ReactNode {
        return (
            <div className="page Self">
                <PageReturn />
                <div className="row-container main-info">
                    <div className="left">
                        <h1 className="name"><span className="inner-container">NULL</span></h1>
                        <BulletRow>
                            he/him
                        </BulletRow>
                        <BulletRow>
                            <span className="medium">eng</span>/id
                        </BulletRow>
                        <BulletRow>
                            <span className="medium">AR 56</span> / <span className="light">asia server</span>
                        </BulletRow>
                    </div>
                    <div className="right">
                        <span className="text-container">I'm null and I like programming</span>
                    </div>
                </div>

                <div className="row-container likes-dislikes">
                    <div className="left">
                        <h2 className="subheading">likes</h2>
                        <BulletRow bulletStyle="dot">osu!</BulletRow>
                        <BulletRow bulletStyle="dot">genshin</BulletRow>
                        <BulletRow bulletStyle="dot">star wars</BulletRow>
                        <BulletRow bulletStyle="dot">coffee <span className="light" style={{ fontSize: 24 }}>(it's an addiction at this point)</span></BulletRow>
                    </div>
                    <div className="right">
                        <h2 className="subheading">dislikes</h2>
                        <BulletRow bulletStyle="dot">sweet coffee</BulletRow>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Self;
export { SelfProps, SelfStates };