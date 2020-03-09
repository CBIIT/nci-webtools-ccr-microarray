import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
// import './MainContent.css';
// import About from '../About/About';
import Analysis from '../Analysis/Analysis';
// import Help from '../Help/Help';

export default function MainContent() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:code" component={Analysis} />
        <Route path="/" component={Analysis} />
      </Switch>
    </BrowserRouter>
  );
}
