import React, { Component } from 'react';
import { Checkbox, Input,Button } from 'antd';

class Contrast extends Component {
  
    constructor(props) {

        super(props);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);

    }

    handleSwitchChange = (e) => {


        if (e.target.checked) {
            this.props.changeRunContrastMode(true);
        } else {
            this.props.changeRunContrastMode(false);
        }
    }

    render() {

        let options = [];
        let tmp_options = [];
        // find the unique value in grups 
        this.props.data.dataList.filter(function(v, i, self) {
            if (tmp_options.indexOf(v['groups']) == -1 && v['groups'] != "") {
                var d = <option key={v['groups']} value={v['groups']}>{v['groups']}</option>
                options.unshift(d);
                tmp_options.unshift(v['groups']);
            }
        })

        let queueBlock = <div className="block ">
              <div  id="checkbox_queue">  <Checkbox checked={this.props.data.useQueue} onChange={this.handleSwitchChange} >Submit this job to a Queue</Checkbox></div>
               <div className="queueMessage" style={{"paddingLeft":"23px"}}>(Jobs currently enqueued: {this.props.data.numberOfTasksInQueue})</div>
             <label className="title" > Email<span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
             <Input  disabled={!this.props.data.useQueue} id="email"  aria-label="input email"  id="input-email" placeholder="email"/>
             <span className="queueMessage">Note: if sending to queue, when computation is completed, a notification will be sent to the e-mail entered above.</span>
             <div><span className="err-message" id="message-use-queue"></span></div>
              <div><span className="success-message" id="message-success-use-queue"></span></div>
          </div>
        let button = "";
        if (this.props.data.group_1 != "-1" && this.props.data.group_2 != "-1" && this.props.data.group_1 != this.props.data.group_2) {
            button = (<div style={{"padding":"8px 5px 10px 5px","margin":"10px"}}>
                 <Button id="btn-run-contrast" className="ant-btn upload-start ant-btn-primary" onClick={this.props.runContrast} >
              <span>Run Contrast </span>
            </Button></div>);
        } else {
            button = (<div style={{"padding":"8px 5px 10px 5px","margin":"10px"}}>
                <Button id="btn-run-contrast" className="ant-btn upload-start ant-btn-default" onClick={this.props.runContrast} disabled >
              <span>Run Contrast</span>
            </Button></div>);
        }
        let group_1_content = (<select id="select-group-1" className="ant-select-selection ant-select-selection--single" value={this.props.data.group_1} style={{ width: "100%" }}  onChange={this.props.handleGroup1Select}>
            <option value="-1" >---select Group---</option>
            {options}
          </select>);
        let group_2_content = (<select id="select-group-2" className="ant-select-selection ant-select-selection--single" value={this.props.data.group_2} style={{ width: "100%" }}  onChange={this.props.handleGroup2Select}>
            <option value="-1" >---select Group---</option>

            {options}
          </select>);

        var content = "";
        if (options.length <= 1) {
            // if the group have not be defined
            content =
                <div>
                <div className="block ">
                
                <label className="title" htmlFor="select-group-1">Choose Contrast To Show:</label>
                <select id="select-group-1" className="ant-select-selection ant-select-selection--single" value={this.props.data.group_1} style={{ width: "100%" }}  disabled   aria-label="select Group 1">
                  <option value="-1">---select Group---</option>
                </select>
                
                <label className="title" htmlFor="select-group-2">VS:</label>
                 <select  id="select-group-2"  className="ant-select-selection ant-select-selection--single" value={this.props.data.group_2} style={{ width: "100%" }}  disabled aria-label="select Group 2">
                   <option value="-1">---select Group---</option>
                </select>
                
              </div>
              {queueBlock}

                {button}
                <br/>
              </div>
        } else {
            content =
                <div>
               <div className="block">
                  <label className="title"  htmlFor="select-group-1">Choose Contrast To Show: <span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
                  {group_1_content}
                  <label className="title"  htmlFor="select-group-2">VS: <span style={{color:"red","paddingLeft":"5px"}}> *</span></label>
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