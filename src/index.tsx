import React, {
  FC,
} from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import Input from "src/input";
import Chat from "src/chat";
import 'semantic-ui-css/semantic.min.css';
import {
  CoreProvider,
} from "src/module";

const Index: FC = () => {
  return (
    <CoreProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Input} />
          <Route exact path="/chat" component={Chat} />
        </Switch>
      </BrowserRouter>
    </CoreProvider>
  );
};
const element = (<Index />);
const container = document.getElementById("root");

ReactDOM.render(element, container);
