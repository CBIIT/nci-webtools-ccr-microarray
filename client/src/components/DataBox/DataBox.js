import React, { Component } from 'react';
import { Tabs,Table } from 'antd';
import GSMData from './GSMData'
const TabPane = Tabs.TabPane;

class DataBox extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
	}

	handleTabChange = (key) => {
	  console.log(key);
	}

  render() {
  	let prePlotsBox = "";
  	let postPlotsBox = "";
  	let degBox = "";
  	let ssGSEABox = "";
  	if(this.props.data.compared){
		prePlotsBox = (<TabPane tab="Pre-normalization QC Plots" key="2">Content of Tab Pane 2</TabPane>);
		postPlotsBox = (<TabPane tab="Post-normalization Plots" key="3">Content of Tab Pane 3</TabPane>);
		degBox = (<TabPane tab="DEG-Enrichments Results" key="4">Content of Tab Pane 3</TabPane>);
  	}
  	if(this.props.data.done_gsea){
  		ssGSEABox = (<TabPane tab="ssGSEA Results" key="5">Content of Tab Pane 3</TabPane>);	
  	}
  	let content = (<Tabs onChange={this.handleTabChange} type="card">
    				<TabPane tab="GSM Data" key="1"><GSMData data={this.props.data}/></TabPane>
    				{prePlotsBox}
    				{postPlotsBox}
    				{degBox}
    				{ssGSEABox}
  					</Tabs>);

	return (
	    <div className="container-board-right">
	    	{content}
		</div>
	);
  }
}

export default DataBox;