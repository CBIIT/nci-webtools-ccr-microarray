import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './MainContent.css';
import About from '../About/About';
import Analysis from '../Analysis/Analysis';
import Help from '../Help/Help';

class MainContent extends Component {

    render() {
      let match = window.location.pathname;
        if (match.startsWith('/microarray')) {
            match = "/microarray";
        } else {
            match = "";
        }

        return (
        <Switch>
        <Route path={match+'/:code'} component={Analysis}/>
        <Route path={match+'/'} component={Analysis}/>
      </Switch>
        );
    }
}

export default MainContent;