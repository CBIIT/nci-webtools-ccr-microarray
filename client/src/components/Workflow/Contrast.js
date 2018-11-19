import React, { Component } from 'react';
import { Input, Select, Button } from 'antd';
const { Option, OptGroup } = Select;

class Contrast extends Component {

    constructor(props) {
        super(props);
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
            button = (<Button className="ant-btn upload-start ant-btn-default" onClick={this.props.runContrast} disabled >
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
                <br/><br/>
                {button}
              </div>
        } else {
            content = <div className="block">
                  <label className="title">Choose Contrast To Show: <span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  {group_1_content}
                  <label className="title">VS: <span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  {group_2_content}
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