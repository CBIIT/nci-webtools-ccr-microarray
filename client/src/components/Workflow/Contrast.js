import React, { Component } from 'react';
import {Input, Select, Button} from 'antd';
const Option = Select.Option;

class Contrast extends Component {

	constructor(props){
		super(props);
	}

	componentDidMount(){
	}


  render() {

    let options =[];
    let tmp_options=[]
    // find the unique value in grups 
    this.props.data.dataList.filter(function(v,i,self){
        if(tmp_options.indexOf(v['groups'])==-1&&v['groups']!=""){
          var d = <Option value={v['groups']}>{v['groups']}</Option>
          options.push(d);
          tmp_options.push(v['groups']);
        }
      })



  	let button = "";
    if(this.props.data.group_1 != "-1" && this.props.data.group_2 != "-1" && this.props.data.group_1 != this.props.data.group_2){
    	button = (<Button className="ant-btn upload-start ant-btn-primary" onClick={this.props.runContrast} >
              <span>Run Contrast</span>
            </Button>);
    }
    else{

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
	return (
		<div className="block">
			<label className="title">Choose contrast to show:</label>
			{group_1_content}
			<label className="title">VS:</label>
			{group_2_content}
			<label className="title">P-value threshold for DEGs:</label>
			<Input onChange={(e) => this.props.changePDEGs(e)} value={this.props.data.pDEGs}/>
			<label className="title">Fold Change threshold for DEGs:</label>
			<Input onChange={(e) => this.props.changeFoldDEGs(e)} value={this.props.data.foldDEGs}/>
			<label className="title">P-value threshold for pathways:</label>
			<Input onChange={(e) => this.props.changePathways(e)} value={this.props.data.pPathways}/>
			{button}
		</div>
	);
  }
}

export default Contrast;