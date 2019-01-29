import React, { Component } from 'react';
import Project from './Project';
import Contrast from './Contrast';


class Workflow extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        let contrastBox = "";
        contrastBox = <Contrast data={this.props.data} 
                                handleGroup1Select={this.props.handleGroup1Select}
                                handleGroup2Select={this.props.handleGroup2Select}
                                runContrast={this.props.runContrast}
                                changeRUNContractModel={this.props.changeRUNContractModel}

                              />;
        return (
            <div className="container-board-left">
     
          <div className="blocks">
            <Project 
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
            {contrastBox}
          </div>
    </div>
        );
    }
}

export default Workflow;