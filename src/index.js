import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import ClaimAirtime from './web/ClaimAirtime';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route exact path="/" component={App} />
      <Route path="/claimairtime" component={ClaimAirtime} />
    </Routes>
  </Router>
);
