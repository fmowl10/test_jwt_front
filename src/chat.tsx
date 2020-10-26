import React, {
  FC,
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
  MutableRefObject,
} from 'react';
import {
  Input,
  Form,
  Message,
  InputOnChangeData,
} from 'semantic-ui-react';
import {
  IMessageEvent,
  w3cwebsocket as W3CWebSocket,
} from 'websocket';
import { CoreContext } from './module';

const Chat: FC = () => {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [enable, setEnable] = useState(false);
  const [helpVisible, setHelpVisible] = useState(true);
  const socket: MutableRefObject<W3CWebSocket | null> = useRef<W3CWebSocket>(null);
  const {
    key,
    token,
  } = useContext(CoreContext);

  //connnection
  useEffect(() => {
    const host = (window.location.protocol === "https:" ? "wws://" : "ws://")
      + window.location.host + "/ws"
    socket.current = new W3CWebSocket(host, token);
    return () => {
      if (socket.current?.readyState === socket.current?.OPEN) {
        socket.current?.close();
      }
    }
  }, [token])

  //socket handler setting
  useEffect(() => {
    if (socket.current) {
      socket.current.onmessage = (m: IMessageEvent) => {
        setText(`${text}\n${m.data}`);
      };
      socket.current.onopen = () => {
        setText("ws on");
        setEnable(true);
        socket.current?.send(key);
      };
      socket.current.onclose = () => {
        setText(`${text}\ndisconnected`);
        setEnable(false);
      }
    }
  }, [text, enable, key]);

  const handleDismiss = useCallback(() => {
    setHelpVisible(!helpVisible);
  }, [helpVisible]);

  const handleSubmit = useCallback(() => {
    if (!socket.current) {
      return;
    }
    // commands !help, !clear & !quit
    if (message === "!help") {
      setHelpVisible(true);
      return;
    }
    if (message === "!clear") {
      setText("");
      setMessage("");
      return;
    }
    if (message === "!quit") {
      socket.current?.close();
      setMessage("");
      return;
    }
    if (message.length === 0) {
      return;
    }

    if (socket.current.readyState === socket.current?.OPEN) {
      socket.current.send(message);
      setMessage("");
    }
  }, [message]);
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setMessage(data.value);
  }, []);
  return (
    <div style={{
      backgroundColor: "#6b7572",
      padding: 10,
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: "auto"
    }}>

      <div style={{
        backgroundColor: "#f7f7f7",
        padding: 10,
        width: "100%",
        height: "100%",
        overflow: "auto"
      }}>
        {helpVisible &&
          <Message onDismiss={handleDismiss}>
            <Message.List>
              <Message.List>!help show help text</Message.List>
              <Message.List>!clear clear screen</Message.List>
              <Message.List>!quit quit this chat</Message.List>
            </Message.List>
          </Message>}
        <Message hidden={enable} error>
          <Message.Header>Disconnected with Server</Message.Header>
                        if you want to reconnect go <a href="/">here</a>
        </Message>
        <label>You are {key}</label>
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
          {text}
        </p>
        <div>
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Input
              value={message}
              action="Submit"
              fluid
              disabled={!enable}
              onChange={handleChange}
              name="message"
              placeholder="input message"
            />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
