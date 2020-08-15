import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Input, Form, Message, InputOnChangeData } from 'semantic-ui-react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

type Props = {
    location: Location;
    state: Data;
}

type State = {
    text: string;
    message: string;
    enable: boolean;
    helpVisible: boolean;
}

type Data = {
    token: string;
    key: string;
}

class Chat extends React.Component<Props, State> {
    socket: W3CWebSocket;
    constructor(props: Props) {
        super(props)
        this.state = {
            text: '', message: '', enable: false, helpVisible: true
        };
        var host = (window.location.protocol === "https:" ? "wws://" : "ws://")
            + window.location.host + "/ws"
        this.socket = new W3CWebSocket(host, this.props.state.token);
    }
    componentWillMount() {
        this.socket.onopen = () => {
            this.setState({ text: 'Websocket connected' });
            this.setState({ enable: true })
            this.socket.send(this.props.state.key)
        }
        this.socket.onmessage = (message) => {
            if (this.state.text.length === 0) {
                this.setState({ text: message.data as string })
            } else {
                this.setState({ text: this.state.text + "\n" + message.data })
            }
        }
        this.socket.onclose = () => {
            this.setState({ enable: false, text: this.state.text + "\ndisconneted" })
        }
    }

    handleDismiss = () => {
        this.setState({ helpVisible: !this.state.helpVisible })
    }

    handleSubmit = () => {
        const message = this.state.message
        this.setState({ message: "" })
        // commands !help, !clear & !quit
        if (message === "!help") {
            this.setState({ helpVisible: true })
            return
        }
        if (message === "!clear") {
            this.setState({ text: "" })
            return
        }
        if (message === "!quit") {
            this.socket.close()
            return;
        }
        if (message.length === 0) {
            return;
        }
        this.socket.send(this.state.message)
    }
    handleChange = (e: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData) => {
        this.setState({ message: data.value });
    }
    render() {
        const message = this.state.message
        return (
            <div style={{
                backgroundColor: "#6b7572",
                padding: 10,
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }}>

                <div style={{
                    backgroundColor: "#f7f7f7",
                    padding: 10,
                    width: "100%",
                    height: "100%"
                }}>
                    {this.state.helpVisible &&
                        <Message onDismiss={this.handleDismiss}>
                            <Message.List>
                                <Message.List>!help show help text</Message.List>
                                <Message.List>!clear clear screen</Message.List>
                                <Message.List>!quit quit this chat</Message.List>
                            </Message.List>
                        </Message>}
                    <Message hidden={this.state.enable} error>
                        <Message.Header>Disconnected with Server</Message.Header>
                        if you want to reconnect go <a href="/">here</a>
                    </Message>
                    <label>You are {this.props.state.key}</label>
                    <p style={{
                        wordBreak: "break-all",
                        wordWrap: "break-word",
                        whiteSpace: "pre",
                        width: "100%",
                        overflow: "auto",
                        height: "70%",
                        border: "2px solid black",
                        position: "inherit"
                    }}>
                        {this.state.text}
                    </p>
                    <div>
                        <Form onSubmit={this.handleSubmit} autoComplete="off">
                            <Input
                                value={message}
                                action="Submit"
                                fluid
                                disabled={!this.state.enable}
                                onChange={this.handleChange}
                                name="message"
                                placeholder="input message"
                            />
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;