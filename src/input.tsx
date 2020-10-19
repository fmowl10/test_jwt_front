import React, {
  ChangeEvent,
  Component,
  FormEvent,
} from 'react';
import {
  Link,
} from 'react-router-dom';
import {
  Grid,
  Form,
  Button,
  Message,
  InputOnChangeData,
  DropdownProps,
  DropdownItemProps,
} from 'semantic-ui-react';

type State = {
  key: string;
  role: string;
  token: string;
  value: string;
  error: boolean;
  isActive: boolean;
  options: DropdownItemProps[];
}
class Input extends Component<{}, State> {

  state = {
    key: '',
    role: '',
    token: '',
    value: '',
    error: false,
    isActive: true,
    options: [
      { key: 'local', value: 'local', text: 'local' },
      { key: 'host', value: 'host', text: 'host' },
    ],
  };

  postInput = async (url: string, data: Object) => {
    const requestOption: RequestInit = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOption);
    if (response.ok) {
      return await response.json();
    } else {
      const text = await response.text();
      console.log(text);
      return "not working";
    }
  };

  getData = async (url: string, token: string) => {
    const request = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }
    const response = await fetch(url, request);
    if (response.ok) {
      return await response.json();
    } else {
      console.log("you Fucked up");
      return "";
    }
  }

  handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      key,
      role,
    } = this.state;
    if (key.length <= 0 || role.length <= 0) {
      this.setState({ error: true });
      return;
    }
    const data = await this.postInput('/jwt', { key, role });
    this.setState({ token: data.token, error: false });
  };

  handleInputChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    this.setState({ key: data.value });
  };

  handleDropDownChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    this.setState({ role: data.value as string });
    console.log(typeof data.value);
  }

  onApiButtonClicked = async () => {
    try {
      const data = await this.getData("/api", this.state.token)
      this.setState({ value: data });
    } catch (e) {
      this.setState({ value: '' });
    }
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
                  options={this.state.options}
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
