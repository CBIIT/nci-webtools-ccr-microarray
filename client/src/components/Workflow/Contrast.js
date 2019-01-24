import React, { Component } from 'react';
import { Checkbox, Input, Select, Button } from 'antd';
const { Option, OptGroup } = Select;

class Contrast extends Component {
    state = {
        checked: true
    };

    constructor(props) {

        super(props);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);

    }

    handleSwitchChange = (e) => {

        this.setState({ checked: !this.state.checked });

        if (e.target.checked) {
            this.props.changeRUNContractModel(true);
        } else {
            this.props.changeRUNContractModel(false);
        }
    }

    render() {

        let options = [];
        let tmp_options = [];
        // find the unique value in grups 
        this.props.data.dataList.filter(function(v, i, self) {
            if (tmp_options.indexOf(v['groups']) == -1 && v['groups'] != "") {
                var d = <Option key={v['groups']} value={v['groups']}>{v['groups']}</Option>
                options.unshift(d);
                tmp_options.unshift(v['groups']);
            }
        })

        let queueBlock = <div className="block ">
                <Checkbox  checked={this.state.checked} onChange={this.handleSwitchChange} >Submit this job to a Queue</Checkbox>
             <label className="title" > Email<span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
             <Input  id="email"  aria-label="input email"  id="input-email" placeholder="email"/>
             <span id="queueMessage">Note: if sending to queue, when computation is completed, a notification will be sent to the e-mail entered above.</span>
             <div><span className="err-message" id="message-use-queue"></span></div>
              <div><span className="success-message" id="message-success-use-queue"></span></div>
          </div>
        let button = "";
        if (this.props.data.group_1 != "-1" && this.props.data.group_2 != "-1" && this.props.data.group_1 != this.props.data.group_2) {
            button = (<div style={{"padding":"8px 5px 10px 5px","margin":"10px"}}>
                 <Button className="ant-btn upload-start ant-btn-primary" onClick={this.props.runContrast} >
              <span>Run Contrast </span>
            </Button></div>);
        } else {
            button = (<div style={{"padding":"8px 5px 10px 5px","margin":"10px"}}>
                <Button className="ant-btn upload-start ant-btn-default" onClick={this.props.runContrast} disabled >
              <span>Run Contrast</span>
            </Button></div>);
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
            content =
                <div>
                <div className="block ">
                
                <label className="title">Choose Contrast To Show:</label>
                
                <Select defaultValue={this.props.data.group_1} style={{ width: "100%" }}  disabled   aria-label="Select Group 1">
                  <Option value="-1">---Select Group---</Option>
                </Select>
                
                <label className="title">VS:</label>
                 <Select defaultValue={this.props.data.group_2} style={{ width: "100%" }}  disabled aria-label="Select Group 2">
                   <Option value="-1">---Select Group---</Option>
                </Select>
                
              </div>
              {queueBlock}

                {button}
                <br/>
              </div>
        } else {
            content =
                <div>
               <div className="block">
                  <label className="title">Choose Contrast To Show: <span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  {group_1_content}
                  <label className="title">VS: <span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  {group_2_content}
                 
                </div>
               {queueBlock}
                  {button}
                  <br/>
               </div>

        }
        return (
            content
        );
    }
}

export default Contrast;