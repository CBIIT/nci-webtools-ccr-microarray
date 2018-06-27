import React, { Component } from 'react';
import Project from './Project';
import Contrast from './Contrast';
import SSGSEAFilter from './SSGSEAFilter';

class Workflow extends Component {

	constructor(props){
		super(props);
	}

  render() {
      let contrastBox = "";
      if(this.props.data.dataList.length > 0){
        contrastBox = <Contrast data={this.props.data} handleGroup1Select={this.props.handleGroup1Select}  handleGroup2Select={this.props.handleGroup2Select} 
                changePDEGs={this.props.changePDEGs} changeFoldDEGs={this.props.changeFoldDEGs} changePathways={this.props.changePathways} runContrast={this.props.runContrast}/>;
      }
      let SSGSEAFilterBox = "";
      if(this.props.data.compared){
        SSGSEAFilterBox = <SSGSEAFilter data={this.props.data}/>;
      }
      return (
        <div className="container-board-left">
        	<label>CCBR Microarray Analysis Workflow</label>
        	<div className="blocks">
        		<Project data={this.props.data} changeProject={this.props.changeProject} changeCode={this.props.changeCode} handleSelectType={this.props.handleSelectType} fileRemove={this.props.fileRemove} beforeUpload={this.props.beforeUpload} handleUpload={this.props.handleUpload} loadGSE={this.props.loadGSE}/>
        		{contrastBox}
        		{SSGSEAFilterBox}
        	</div>
		</div>
      );
  }
}

export default Workflow;