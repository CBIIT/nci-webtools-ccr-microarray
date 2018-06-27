import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './MainContent.css';
import About from '../About/About';
import Analysis from '../Analysis/Analysis';
import Help from '../Help/Help';

class MainContent extends Component {

  render() {
    let match = window.location.pathname;
    if(match.startsWith('/microarray')){
      match = "/microarray";
    }
    else{
      match = "";
    }
    return (
      <Switch>
        <Route exact path={match+'/'} component={Analysis}/>
        <Route path={match+'/analysis'} component={(props) => (
          <Analysis timestamp={new Date().toString()} {...props} />
        )}/>
        <Route path={match+'/about'} component={About}/>
        <Route path={match+'/help'} component={Help}/>
      </Switch>
    );
  }
}

export default MainContent;