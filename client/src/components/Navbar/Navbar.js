import React, { Component } from 'react';

class Navbar extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
	}

  render() {
      return (
        <div className="header-nav">
            <div className="div-container">
                <ul className="nav navbar-nav">
                    <li className=""><a className="nav-link" href="#map-about">About Microarray</a></li>
                    <li className="active"><a className="nav-link" href="#map-app">Analysis</a></li>
                </ul>
                <span className="nav-help">Help</span>
            </div>
        </div>
      );
  }
}

export default Navbar;