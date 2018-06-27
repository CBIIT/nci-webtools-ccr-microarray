import React, { Component } from 'react';
import './App.css';
import Navbar from '../Navbar/Navbar';
import MainContent from '../MainContent/MainContent';

class App extends Component {
  render() {
    return (
    	<div>
	    	<Navbar />
	    	<MainContent />
        </div>
    );
  }
}

export default App;
