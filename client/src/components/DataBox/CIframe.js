import React, { Component } from 'react';

class CIframe  extends Component {
  constructor(props) {
    super(props);
    this.props.showLoading();
  }

hideSpinner = () => {
    this.props.onLoadComplete();
  };
render() {
    return (
      <div >
         <iframe onLoad={this.hideSpinner} title={this.props.title}  src={this.props.link}  width={'100%'} height={'600px'} frameBorder={'0'} />
      </div>
    );
  }
}

export default CIframe;