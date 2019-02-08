import React, { Component } from 'react';
import { Input, Select, Upload, Button, Icon, message } from 'antd';
const Option = Select.Option;

class Project extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { uploading } = this.props.data;
        const properties = {
            accept:'.gz,.cel,.CEL,.gz',
            action: '-',
            onRemove: (file) => {
                this.props.fileRemove(file);
            },
            beforeUpload: (file, fl) => {
                this.props.beforeUpload(fl);
                return false;
            },
            multiple: true,
            fileList: this.props.data.fileList
        };

        let type_content = (<div className="row"> <div className="col-sm-12"><Select value={this.props.data.analysisType} style={{ width: "100%" }} onChange={this.props.handleSelectType}>
            <Option value="0">GEO Data</Option>
            <Option value="1">CEL files</Option>
          </Select></div></div>);
        let source = "";

        if (this.props.data.analysisType == "0") {
            source = (
                <div>
                <div className="row">
                    <div className="col-sm-12">
                    
                      <label className="title">Accession Code<span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                       <span className="err-message" id="message-load-accession-code"></span>
                      <Input  aria-label="input accessionCode"  id="input-access-code" onChange={(e) => this.props.changeCode(e)} value={this.props.data.accessionCode}/>
                      </div>
                </div>
                <div className="row">
                      <div className="col-sm-6">
                    
                        <button id="btn-project-load-gse" type="button" className="ant-btn upload-start ant-btn-primary" onClick={this.props.loadGSE}>
                          <span>{uploading ? 'Load' : 'Load' }</span>
                        </button>

                      
                      </div>
                      <div className="col-sm-6">
                   
                          <Button
                                  className="upload-start"
                                  type="primary"
                                  onClick={this.props.resetWorkFlowProject}
                                >
                                Reset
                                </Button>
                       </div>
                 
                </div>
              </div>
            );
        } else if (this.props.data.analysisType == "1") {
            source = (<div className="upload-block row">
                   <div className="col-sm-12">
                    <Upload {...properties}>
                      <Button>
                        <Icon type="upload" /> Select File
                      </Button>
                    </Upload>
                    </div>
                     <div className="col-sm-6">
                    <Button
                      id="btn-project-upload"
                      className="upload-start"
                      type={this.props.data.fileList.length === 0? "default":"primary"}
                      onClick={this.props.handleUpload}
                      disabled={this.props.data.fileList.length === 0}
                      loading={uploading}
                    >
                    {uploading ? 'Load' : 'Load' }
                    </Button>
                  
                   </div>

                     <div className="col-sm-6">
                         <Button
                          className="upload-start"
                          type="primary"
                          onClick={this.props.resetWorkFlowProject}
                        >
                        Reset
                        </Button>
                    </div>
                  </div>);
        } else {
            source = (<div className="upload-block row">
                    <div className="col-sm-6">
                        <Button
                          className="upload-start"
                          type="default"
                       
                          disabled
                        >
                        Load
                        </Button>
                    </div>
                    <div className="col-sm-6">
                         <Button
                          className="upload-start"
                          type="primary"
                          onClick={this.props.resetWorkFlowProject}
                        >
                        Reset
                        </Button>
                    </div>
                    

                  </div>);;
        }
        return (
            <div className="block">
              <div className="row">
                <div className="col-sm-12">
                  <label className="title">Choose analysis type</label>
                </div>
              </div>
          {type_content}
          {source}
        </div>
        );
    }
}

export default Project;