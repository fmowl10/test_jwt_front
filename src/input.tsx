import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useState,
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

const Input: FC = () => {
  const [error, setError] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [key, setKey] = useState("");
  const [role, setRole] = useState("");
  const [value, setValue] = useState("");
  const [options] = useState<DropdownItemProps[]>([
    { key: 'local', value: 'local', text: 'local' },
    { key: 'host', value: 'host', text: 'host' },
  ]);

  const handleDropDownChange = useCallback((e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setRole(data.value as string);
    console.log(typeof data.value);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (key.length <= 0 || role.length <= 0) {
      setError(true);
      return;
    }
    const requestOption: RequestInit = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ key, role }),
    };
    const response = await fetch("/jwt", requestOption);
    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      setError(false);
    } else {
      const text = await response.text();
      console.log(text);
      return "not working";
    }
  }, [key, role]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setKey(data.value);
  }, []);

  const onApiButtonClicked = useCallback(async () => {
    try {
      if (token == null) {
        return;
      }
      const request = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
      const response = await fetch("/api", request);
      if (response.ok) {
        const data = await response.json();
        setValue(data);
      } else {
        console.log("you Fucked up");
        return "";
      }
    } catch (e) {
      setValue("");
    }
  }, [token]);

  return (
    <div style={
      { width: 400, border: "5px solid black", borderRadius: 20, padding: 10 }}>
      <Grid columns={2}>
        <Grid.Column>
          <Form onSubmit={handleSubmit} error={error}>
            {error && <Message error header="input both thing" />}
            <Form.Field>
              <label>Key</label>
              <Form.Input
                name="key"
                onChange={handleInputChange}
                placeholder='input key'
              />
              <Form.Dropdown
                name="role"
                onChange={handleDropDownChange}
                placeholder="pick a role"
                options={options}
                selection
                clearable
              />
            </Form.Field>
            <Form.Button content='Submit' />
          </Form>
        </Grid.Column>
        <Grid.Column>
          {token !== 'not working' && token &&
            <div>
              <div style={{ marginBottom: 10, marginRight: 10, width: 150, wordBreak: "break-all", wordWrap: "break-word", }}>
                {token}
              </div>
              <div style={{ marginBottom: 10, marginTop: 10 }}>
                <Button name="apiButton" onClick={onApiButtonClicked}>Get Hello</Button>
              </div>
              <Link to={{ pathname: "/chat", state: { token: token, key: key } }}>
                <Button name="chatButton">Go Chat</Button>
              </Link>
              <h1 id='api'>{value}</h1>
            </div>
          }
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Input;
