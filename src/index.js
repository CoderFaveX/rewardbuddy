import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import ClaimAirtime from './web/ClaimAirtime';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/claimairtime" component={ClaimAirtime} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
