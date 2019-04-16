import React, { Component } from 'react';
import Project from './Project';
import Contrast from './Contrast';

class Workflow extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let contrastBox = <Contrast data={this.props.data} 
                                handleGroup1Select={this.props.handleGroup1Select}
                                handleGroup2Select={this.props.handleGroup2Select}
                                runContrast={this.props.runContrast}
                                changeRunContrastMode={this.props.changeRunContrastMode}
                                handleNormalSelect = {this.props.handleNormalSelect}
                              />;
        let project = <Project 
                    data={this.props.data}  
                    resetWorkFlowProject={this.props.resetWorkFlowProject} 
                    changeCode={this.props.changeCode} 
                    handleSelectType={this.props.handleSelectType} 
                    fileRemove={this.props.fileRemove} 
                    beforeUpload={this.props.beforeUpload} 
                    handleUpload={this.props.handleUpload} 
                    loadGSE={this.props.loadGSE}
                    exportGSE={this.props.exportGSE}
                    />
        return (
            <div className="container-board-left">
                  <div className="blocks">
                    {project}
                    {contrastBox}
                  </div>
            </div>
        );
    }
}

export default Workflow;