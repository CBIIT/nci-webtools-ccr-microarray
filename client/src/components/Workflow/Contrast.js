import React, { Component } from 'react';
import { Input, Select, Button } from 'antd';
const { Option, OptGroup } = Select;

class Contrast extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    handleGeneChange() {

    }

    render() {

        let options = [];
        let tmp_options = []
        // find the unique value in grups 
        this.props.data.dataList.filter(function(v, i, self) {
            if (tmp_options.indexOf(v['groups']) == -1 && v['groups'] != "") {
                var d = <Option key={v['groups']} value={v['groups']}>{v['groups']}</Option>
                options.push(d);
                tmp_options.push(v['groups']);
            }
        })



        let button = "";
        if (this.props.data.group_1 != "-1" && this.props.data.group_2 != "-1" && this.props.data.group_1 != this.props.data.group_2) {
            button = (<Button className="ant-btn upload-start ant-btn-primary" onClick={this.props.runContrast} >
              <span>Run Contrast</span>
            </Button>);
        } else {
            button = (<Button className="ant-btn upload-start ant-btn-primary" onClick={this.props.runContrast} disabled >
              <span>Run Contrast</span>
            </Button>);
        }
        let group_1_content = (<Select defaultValue={this.props.data.group_1} style={{ width: "100%" }}  onChange={this.props.handleGroup1Select}>
            <Option value="-1">---Select Group---</Option>
            {options}
          </Select>);
        let group_2_content = (<Select defaultValue={this.props.data.group_2} style={{ width: "100%" }}  onChange={this.props.handleGroup2Select}>
            <Option value="-1">---Select Group---</Option>
            {options}
          </Select>);

        var content = "";
        if (options.length <= 1) {
           // if the group have not be defined
            content = <div className="block ">
                
                <label className="title">Choose Contrast To Show:</label>
                
                <Select defaultValue={'-1'} style={{ width: "100%" }}  disabled   aria-label="Select Group 1">
                  <Option value="-1">---Select Group---</Option>
                </Select>
                
                <label className="title">VS:</label>
                 <Select defaultValue={'-1'} style={{ width: "100%" }}  disabled aria-label="Select Group 2">
                   <Option value="-1">---Select Group---</Option>
                </Select>
                <div style={{"display":"none"}} >
                <label className="title">P-value Threshold For DEGs:</label>
                <Input disabled onChange={(e) => this.props.changePDEGs(e)} value={this.props.data.pDEGs} aria-label="P-value Threshold For DEGs"/>
                <label className="title">Fold Change Threshold For DEGs:</label>
                <Input disabled  onChange={(e) => this.props.changeFoldDEGs(e)} value={this.props.data.foldDEGs} aria-label="Fold Change Threshold For DEGs"/>
                <label className="title">P-value Threshold For Pathways:</label>
                <Input disabled onChange={(e) => this.props.changePathways(e)} value={this.props.data.pPathways} aria-label="P-value Threshold For Pathways"/>
                <label className="title">Choose Gene Set For ssGSEA:</label>
                  <Select defaultValue="human$H: Hallmark Gene Sets"  disabled
                        style={{ width: '100%' }}
                        onChange={(e) => this.props.handleGeneChange(e)} 
                        aria-label="Gene Set For ssGSEA"
                      >
                        <OptGroup label="Human">
                          <Option value="human$H: Hallmark Gene Sets">H: Hallmark Gene Sets</Option>
                          <Option value="human$C1: Positional Gene Sets">C1: Positional Gene Sets</Option>
                          <Option value="human$C2: Curated Gene Sets">C2: Curated Gene Sets</Option>
                          <Option value="human$C3: Motif Gene Sets">C3: Motif Gene Sets</Option>
                          <Option value="human$C4: Computational Gene Sets">C4: Computational Gene Sets</Option>
                          <Option value="human$C5: GO gene sets">C5: GO gene sets</Option>
                          <Option value="human$C6: Oncogenic Signatures">C6: Oncogenic Signatures</Option>
                          <Option value="human$C7: Immunologic Signatures">C7: Immunologic Signatures</Option>
                        </OptGroup>
                        <OptGroup label="Mouse">
                          <Option value="mouse$H: Hallmark Gene Sets">H: Hallmark Gene Sets</Option>
                          <Option value="mouse$C2: Curated Gene Sets">C2: Curated Gene Sets</Option>
                          <Option value="mouse$C3: Motif Gene Sets">C3: Motif Gene Sets</Option>
                          <Option value="mouse$C4: Computational Gene Sets">C4: Computational Gene Sets</Option>
                          <Option value="mouse$C5: GO gene sets">C5: GO gene sets</Option>
                          <Option value="mouse$C6: Oncogenic Signatures">C6: Oncogenic Signatures</Option>
                          <Option value="mouse$C7: Immunologic Signatures">C7: Immunologic Signatures</Option>
                        </OptGroup>
                      </Select>
                         <label className="title">P-value Threshold For ssGSEA</label>
                        <Input disabled onChange={(e) => this.props.changePssGSEA(e)} value={this.props.data.pssGSEA} aria-label="P-value Threshold For ssGSEA"/>
               
                         <label className="title">Fold Change Threshold For ssGSEA</label>
                        <Input disabled onChange={(e) => this.props.changeFoldSSGSEA(e)} value={this.props.data.foldssGSEA} aria-label="Fold Change Threshold For ssGSEA"/>
                        </div>
                         <br/><br/>
                {button}
              </div>
        } else {
            content = <div className="block">
                  <label className="title">Choose Contrast To Show: <span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  {group_1_content}
                  <label className="title">VS: <span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  {group_2_content}
                   <div style={{"display":"none"}} >
                  <label className="title">P-value Threshold For DEGs:<span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  <Input onChange={(e) => this.props.changePDEGs(e)} value={this.props.data.pDEGs} aria-label="P-value Threshold For DEGs"/>
                  <label className="title">Fold Change Threshold For DEGs:<span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  <Input onChange={(e) => this.props.changeFoldDEGs(e)} value={this.props.data.foldDEGs}  aria-label="Fold Change Threshold For DEGs"/>
                  <label className="title">P-value Threshold For Pathways:<span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  <Input onChange={(e) => this.props.changePathways(e)} value={this.props.data.pPathways} aria-label="P-value Threshold For Pathways"/>
                   <label className="title">Choose Gene Set For ssGSEA:<span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                   <Select defaultValue="human$h.all.v6.1.symbols.gmt" 
                        style={{ width: '100%' }}
                        onChange={(e) => this.props.handleGeneChange(e)} 
                        aria-label="Gene Set For ssGSEA"
                      >
                        <OptGroup label="Human">
                          <Option value="human$H: Hallmark Gene Sets">H: Hallmark Gene Sets</Option>
                          <Option value="human$C1: Positional Gene Sets">C1: Positional Gene Sets</Option>
                          <Option value="human$C2: Curated Gene Sets">C2: Curated Gene Sets</Option>
                          <Option value="human$C3: Motif Gene Sets">C3: Motif Gene Sets</Option>
                          <Option value="human$C4: Computational Gene Sets">C4: Computational Gene Sets</Option>
                          <Option value="human$C5: GO gene sets">C5: GO gene sets</Option>
                          <Option value="human$C6: Oncogenic Signatures">C6: Oncogenic Signatures</Option>
                          <Option value="human$C7: Immunologic Signatures">C7: Immunologic Signatures</Option>
                        </OptGroup>
                        <OptGroup label="Mouse">
                          <Option value="mouse$H: Hallmark Gene Sets">H: Hallmark Gene Sets</Option>
                          <Option value="mouse$C2: Curated Gene Sets">C2: Curated Gene Sets</Option>
                          <Option value="mouse$C3: Motif Gene Sets">C3: Motif Gene Sets</Option>
                          <Option value="mouse$C4: Computational Gene Sets">C4: Computational Gene Sets</Option>
                          <Option value="mouse$C5: GO gene sets">C5: GO gene sets</Option>
                          <Option value="mouse$C6: Oncogenic Signatures">C6: Oncogenic Signatures</Option>
                          <Option value="mouse$C7: Immunologic Signatures">C7: Immunologic Signatures</Option>
                        </OptGroup>
                      </Select>
                         <label className="title">P-value Threshold For ssGSEA<span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                        <Input onChange={(e) => this.props.changePssGSEA(e)} value={this.props.data.pssGSEA}  aria-label="P-value Threshold For ssGSEA"/>
               
                         <label className="title">Fold Change Threshold For ssGSEA<span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                        <Input onChange={(e) => this.props.changeFoldSSGSEA(e)} value={this.props.data.foldssGSEA} aria-label="Fold Change Threshold For ssGSEA"/>
                      </div>
                      <br/><br/>
                  {button}
                </div>

        }
        return (
            content
        );
    }
}

export default Contrast;