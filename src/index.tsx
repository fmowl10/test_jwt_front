import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Input from './input';
import Chat from './chat';


function Index() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Input} />
        <Route path="/chat" component={Chat} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(<Index />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
