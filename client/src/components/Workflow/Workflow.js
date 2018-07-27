import React, { Component } from 'react';
import Project from './Project';
import Contrast from './Contrast';


class Workflow extends Component {

	constructor(props){
		super(props);
	}
  render() {
      let contrastBox = "";
        contrastBox = <Contrast data={this.props.data} 
                                handleGeneChange={this.props.handleGeneChange}
                                changeFoldSSGSEA={this.props.changeFoldSSGSEA}
                                changePssGSEA={this.props.changePssGSEA}
                                handleGroup1Select={this.props.handleGroup1Select}
                                handleGroup2Select={this.props.handleGroup2Select}
                                changePDEGs={this.props.changePDEGs}
                                changeFoldDEGs={this.props.changeFoldDEGs}
                                changePathways={this.props.changePathways}
                                runContrast={this.props.runContrast}
                              />;
      return (
        <div className="container-board-left">
     
        	<div className="blocks">
        		<Project data={this.props.data}  resetWorkFlowProject={this.props.resetWorkFlowProject} changeProject={this.props.changeProject} changeCode={this.props.changeCode} handleSelectType={this.props.handleSelectType} fileRemove={this.props.fileRemove} beforeUpload={this.props.beforeUpload} handleUpload={this.props.handleUpload} loadGSE={this.props.loadGSE}/>
        		{contrastBox}
        	</div>
		</div>
      );
  }
}

export default Workflow;