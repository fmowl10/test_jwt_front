import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Form, Button, Message, InputOnChangeData, DropdownProps } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

type State = {
    key: string;
    role: string;
    token: string;
    value: string;
    error: boolean;
}


class Input extends React.Component<{}, State> {
    isActive: Boolean;
    options: Array<Object>;
    constructor(props: {}) {
        super(props);
        this.state = {
            key: '', role: '', token: '', value: '', error: false
        }
        this.isActive = true;
        this.options = [{ key: 'local', value: 'local', text: 'local' },
        { key: 'host', value: 'host', text: 'host' }];
    }
    postInput = (url: string, data: Object) => {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                console.log(response.text())
                return "not working"
            }
        });
    }
    getData = (url: string, token: string) => {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(response => response.text())
            .catch(error => { console.log(error); return 'not working' });
    }

    handleSubmit = async () => {
        const value = { key: this.state.key, role: this.state.role };
        if (value.key.length <= 0 || value.role.length <= 0) {
            this.setState({ error: true });
            return;
        }
        const data = await this.postInput('/jwt', value);
        this.setState({ token: data.token, error: false });
    }

    handleInputChange = (e: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData) => {
        this.setState({ key: data.value });
    }

    handleDropDownChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        this.setState({ role: data.value as string });
        console.log(typeof data.value);
    }

    onApiButtonClicked = () => {
        this.setState({ value: '' })
        this.getData("/api", this.state.token)
            .then(data => {
                this.setState({ value: data })
            })
    }
    render() {
        return (
            <div style={
                { width: 400, border: "5px solid black", borderRadius: 20, padding: 10 }}>
                <Grid columns={2}>
                    <Grid.Column>
                        <Form onSubmit={this.handleSubmit} error={this.state.error}>
                            {this.state.error && <Message error header="input both thing" />}
                            <Form.Field>
                                <label>Key</label>
                                <Form.Input
                                    name="key"
                                    onChange={this.handleInputChange}
                                    placeholder='input key'
                                />
                                <Form.Dropdown
                                    name="role"
                                    onChange={this.handleDropDownChange}
                                    placeholder="pick a role"
                                    options={this.options}
                                    selection
                                    clearable
                                />
                            </Form.Field>
                            <Form.Button content='Submit' />
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        {this.state.token !== 'not working' && this.state.token &&
                            <div>
                                <div style={
                                    { marginBottom: 10, marginRight: 10, width: 150, wordBreak: "break-all", wordWrap: "break-word", }}>
                                    {this.state.token}</div>
                                <div style={{ marginBottom: 10, marginTop: 10 }}>
                                    <Button name="apiButton" onClick={this.onApiButtonClicked}>
                                        Get Hello
                                    </Button>
                                </div>
                                <Link to={{
                                    pathname: "/chat",
                                    state: { token: this.state.token, key: this.state.key }
                                }}><Button name="chatButton">Go Chat</Button></Link>
                                <h1 id='api'>{this.state.value}</h1>
                            </div>
                        }
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Input;