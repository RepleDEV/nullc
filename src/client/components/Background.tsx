import React, { Component } from "react";
import { BasicComponentProps } from "../types/Component";

import { CSSTransition, TransitionStatus } from "react-transition-group";

const MESSAGES = [
    "ninily"
];

interface MessageObject {
    content: string;
    pos: {
        x: number;
        y: number;
    };
}
interface BackgroundStates {
    width: number;
    height: number;
    messages: MessageObject[];
    show: boolean;
}
class Background extends Component<BasicComponentProps, BackgroundStates> {
    constructor(props: BasicComponentProps) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            messages: [],
            show: false,
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.generateMessages = this.generateMessages.bind(this);
        this.generateRandomMessage = this.generateRandomMessage.bind(this);
        this.generateRandomTime = this.generateRandomTime.bind(this);
        this.generateRandomPosition = this.generateRandomPosition.bind(this);

        this.showMessages = this.showMessages.bind(this);
        this.hideMessages = this.hideMessages.bind(this);
    }

    generateMessages() {
        const { width, height } = this.state;
        // (w * 1/4 / 32px) * (h * 1/4 / 32px)
        const messageAmount = (width * 1/6 / 32) * (height * 1/6 / 32);
        const messages: MessageObject[] = [];

        for (let i = 0;i < messageAmount;i++) {
            const pos = this.generateRandomPosition();
            const message = this.generateRandomMessage();
            messages.push(
                {
                    content: message,
                    pos,
                }
            );
        }

        this.setState({ messages });
    }
    
    generateRandomMessage() {
        return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    }

    generateRandomTime(minMillis: number, maxMillis: number) {
        return Math.floor(Math.random() * (maxMillis - minMillis) + minMillis);
    }

    generateRandomPosition() {
        const x = Math.random() * this.state.width;
        const y = Math.random() * this.state.height;

        return { x, y };
    }

    showMessages() {
        const randDelay = this.generateRandomTime(500, 1500);

        setTimeout(() => {
            if (this.state.show)
                return
            this.generateMessages();
            this.setState({ show: true });
        }, randDelay);
    }
    hideMessages() {
        const randDelay = this.generateRandomTime(8000, 9500);

        return setTimeout(() => {
            if (!this.state.show)
                return
            this.setState({ show: false });
        }, randDelay);
    }

    componentDidUpdate(prevProps: BasicComponentProps, prevState: BackgroundStates) {
        if (prevState.width === 0 && this.state.width > 0 &&
            prevState.height === 0 && this.state.height > 0) {
                this.showMessages();
            }
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render(): React.ReactNode {
        const messages: React.ReactNode[] = [];
        for (const { content, pos } of this.state.messages)
            messages.push(
                <span 
                    className="message"
                    style={{
                        transform: `translate(${pos.x}px, ${pos.y}px)`,
                    }}
                    key={`${pos.x}/${pos.y}/${content}`}
                    >
                    { content }
                </span>
            );

        const { show } = this.state;

        // WTF IS THIS TYPE?!?!
        const transitionStyles: {
                [P in TransitionStatus]?: React.CSSProperties
        } = {
            entering: { 
                opacity: 1,
                transform: "translateY(0px)",
            },
            entered: { 
                opacity: 1,
                transform: "translateY(-20px)",
            },
            exiting: {
                opacity: 0,
                transform: "translateY(-20px)",
            },
            exited: { 
                opacity: 0,
                transform: "translateY(0px)",
            },
        };

        const duration = 800;
        return (
            <div className="background">
                <CSSTransition
                    classNames="message-fade"
                    in={show}
                    timeout={duration}
                    onEntered={() => {
                        this.hideMessages();
                    }}
                    onExited={() => {
                        this.showMessages();
                    }}
                >
                    {
                        state => (
                            <div 
                                className="message-container"
                                style={{
                                    transition: `opacity ${duration}ms ease-in-out, transform 8000ms ease-out`,
                                    opacity: 0,
                                    transform: "translateY(0px)",
                                    ...transitionStyles[state],
                                }}
                                >
                                {messages}
                            </div>
                        )
                    }
                </CSSTransition>
            </div>
        );
    }
}

export default Background;